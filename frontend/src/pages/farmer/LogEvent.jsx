import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, apiErrorMessage } from "../../lib/api";
import { Spinner } from "../../components/Spinner";
import { StageStepper } from "../../components/StageStepper";
import { QrIcon, Check, stageIcons, Sprout } from "../../components/Icons";
import { STAGE_KEYS, stageLabel, formatDate, num } from "../../lib/format";

function QrScanner({ onDetected, onClose }) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let stream;
    let raf;
    const supported = "BarcodeDetector" in window;
    if (!supported) {
      setErr(t("logEvent.scannerUnsupported"));
      return;
    }
    const detector = new window.BarcodeDetector({ formats: ["qr_code"] });

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          tick();
        }
      } catch {
        setErr(t("logEvent.cameraBlocked"));
      }
    }
    async function tick() {
      if (!videoRef.current) return;
      try {
        const codes = await detector.detect(videoRef.current);
        if (codes.length) {
          onDetected(codes[0].rawValue);
          return;
        }
      } catch {
        /* keep trying */
      }
      raf = requestAnimationFrame(tick);
    }
    start();
    return () => {
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((tr) => tr.stop());
    };
  }, [onDetected, t]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4">
      <div className="card w-full max-w-sm overflow-hidden">
        <div className="relative aspect-square bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            playsInline
          />
          <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-white/70" />
        </div>
        <div className="p-4">
          {err && <p className="text-sm text-red-600">{err}</p>}
          <p className="text-xs text-ink/50">{t("logEvent.pointCamera")}</p>
          <button onClick={onClose} className="btn-secondary mt-3 w-full py-2">
            {t("logEvent.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LogEvent() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [batches, setBatches] = useState(null);
  const [batchId, setBatchId] = useState(id || "");
  const [scanning, setScanning] = useState(false);
  const [form, setForm] = useState({
    stage: "harvest",
    quantity_ok: "",
    quantity_damaged: 0,
    location: "",
    note: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api
      .get("/batches/", { params: { mine: 1 } })
      .then((res) => setBatches(res.data.results))
      .catch(() => setError(t("logEvent.loadError")));
  }, [t]);

  const selected = batches?.find((b) => String(b.id) === String(batchId));

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleScan(value) {
    setScanning(false);
    const match = batches?.find(
      (b) => value.includes(b.qr_code) || b.qr_code === value
    );
    if (match) {
      setBatchId(String(match.id));
      setError(null);
    } else {
      setError(t("logEvent.qrNoMatch"));
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!batchId) {
      setError(t("logEvent.pickBatchFirst"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post(`/batches/${batchId}/track-event/`, {
        ...form,
        quantity_ok: Number(form.quantity_ok),
        quantity_damaged: Number(form.quantity_damaged) || 0,
      });
      setDone(true);
      setTimeout(() => navigate("/farmer"), 1100);
    } catch (err) {
      setError(apiErrorMessage(err, t("logEvent.submitError")));
    } finally {
      setLoading(false);
    }
  }

  if (!batches) return <Spinner full label={t("logEvent.loading")} />;

  if (done)
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <div className="card p-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest">
            <Check className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-ink">
            {t("logEvent.doneTitle")}
          </h1>
          <p className="mt-1 text-sm text-ink/55">{t("logEvent.doneText")}</p>
        </div>
      </div>
    );

  return (
    <div className="container-page py-12">
      {scanning && (
        <QrScanner onDetected={handleScan} onClose={() => setScanning(false)} />
      )}

      <Link to="/farmer" className="text-sm font-medium text-forest hover:underline">
        <span className="rtl-flip inline-block">←</span> {t("logEvent.back")}
      </Link>
      <h1 className="mt-3 text-3xl font-bold text-ink">{t("logEvent.title")}</h1>
      <p className="mt-2 text-ink/55">{t("logEvent.subtitle")}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <form onSubmit={submit} className="card space-y-5 p-6">
          <div>
            <div className="flex items-center justify-between">
              <label className="label mb-0">{t("logEvent.batch")}</label>
              <button
                type="button"
                onClick={() => setScanning(true)}
                className="btn-ghost py-1.5 text-xs"
              >
                <QrIcon className="h-4 w-4" /> {t("logEvent.scanQr")}
              </button>
            </div>
            <select
              className="input mt-1.5"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              required
            >
              <option value="">{t("logEvent.selectBatch")}</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.crop_type} — {b.farm_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">{t("logEvent.stage")}</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {STAGE_KEYS.map((key) => {
                const Icon = stageIcons[key] || Sprout;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => update("stage", key)}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-xs font-semibold transition-all ${
                      form.stage === key
                        ? "border-forest bg-forest-50 text-forest"
                        : "border-black/10 text-ink/50 hover:border-forest/40"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {stageLabel(key)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">{t("logEvent.qtyOk")}</label>
              <input
                type="number"
                min="0"
                className="input"
                value={form.quantity_ok}
                onChange={(e) => update("quantity_ok", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">{t("logEvent.qtyDamaged")}</label>
              <input
                type="number"
                min="0"
                className="input"
                value={form.quantity_damaged}
                onChange={(e) => update("quantity_damaged", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">{t("logEvent.location")}</label>
            <input
              className="input"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder={t("logEvent.locationPlaceholder")}
            />
          </div>
          <div>
            <label className="label">{t("logEvent.note")}</label>
            <input
              className="input"
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? t("logEvent.logging") : t("logEvent.submit")}
          </button>
        </form>

        <div className="card h-fit p-6">
          <h2 className="text-lg font-bold text-ink">
            {selected ? selected.crop_type : t("logEvent.previewTitle")}
          </h2>
          {selected ? (
            <>
              <p className="text-sm text-ink/55">
                {t("logEvent.previewFarmQty", {
                  farm: selected.farm_name,
                  qty: num(selected.quantity_kg),
                })}
              </p>
              <StageStepper currentStage={form.stage} className="mt-6" />
              <p className="mt-4 text-xs text-ink/45">
                {t("logEvent.previewHarvest", {
                  date: formatDate(selected.expected_harvest_date),
                })}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink/50">
              {t("logEvent.previewEmpty")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
