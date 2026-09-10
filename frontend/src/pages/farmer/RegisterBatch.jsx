import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, apiErrorMessage } from "../../lib/api";
import { QrIcon, Check } from "../../components/Icons";

const empty = {
  crop_type: "",
  crop_type_ar: "",
  farm_name: "",
  category: "crop",
  description: "",
  description_ar: "",
  quantity_kg: "",
  price_per_share: 250,
  share_size_kg: 5,
  planted_date: "",
  expected_harvest_date: "",
  photo_url: "",
};

export default function RegisterBatch() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState(empty);
  const [farms, setFarms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);

  useEffect(() => {
    api
      .get("/farms/", { params: { mine: 1 } })
      .then((res) => setFarms(res.data.results))
      .catch(() => {});
  }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/batches/", {
        ...form,
        quantity_kg: Number(form.quantity_kg),
        price_per_share: Number(form.price_per_share),
        share_size_kg: Number(form.share_size_kg),
      });
      setCreated(data);
    } catch (err) {
      setError(apiErrorMessage(err, t("registerBatch.error")));
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
        <div className="card w-full max-w-md p-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest">
            <Check className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-ink">
            {t("registerBatch.doneTitle")}
          </h1>
          <p className="mt-1 text-sm text-ink/55">
            {created.crop_type} · {created.farm.name}
          </p>
          {created.qr_image && (
            <>
              <img
                src={created.qr_image}
                alt=""
                className="mx-auto mt-5 h-44 w-44"
              />
              <p className="mt-2 font-mono text-xs text-ink/40" dir="ltr">
                {created.qr_code}
              </p>
              <a
                href={created.qr_image}
                download={`nabta-${created.qr_code}.png`}
                className="btn-secondary mt-4 w-full"
              >
                <QrIcon className="h-4 w-4" /> {t("registerBatch.downloadQr")}
              </a>
            </>
          )}
          <div className="mt-3 flex gap-2">
            <Link
              to={`/farmer/batches/${created.id}/log`}
              className="btn-primary flex-1"
            >
              {t("registerBatch.logFirst")}
            </Link>
            <Link to="/farmer" className="btn-ghost flex-1">
              {t("registerBatch.dashboard")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <Link to="/farmer" className="text-sm font-medium text-forest hover:underline">
        <span className="rtl-flip inline-block">←</span> {t("registerBatch.back")}
      </Link>
      <h1 className="mt-3 text-3xl font-bold text-ink">
        {t("registerBatch.title")}
      </h1>
      <p className="mt-2 text-ink/55">{t("registerBatch.subtitle")}</p>

      <form onSubmit={submit} className="mt-8 max-w-2xl space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">{t("registerBatch.cropType")}</label>
            <input
              className="input"
              value={form.crop_type}
              onChange={(e) => update("crop_type", e.target.value)}
              placeholder={t("registerBatch.cropTypePlaceholder")}
              required
            />
          </div>
          <div>
            <label className="label">{t("registerBatch.category")}</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="crop">{t("common.crop")}</option>
              <option value="animal">{t("common.animal")}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">
            {i18n.language === "ar"
              ? t("registerBatch.cropType") + " (English)"
              : t("registerBatch.cropTypeAr")}
          </label>
          <input
            className="input"
            dir={i18n.language === "ar" ? "ltr" : "rtl"}
            value={form.crop_type_ar}
            onChange={(e) => update("crop_type_ar", e.target.value)}
            placeholder={t("registerBatch.cropTypeArPlaceholder")}
          />
        </div>

        <div>
          <label className="label">{t("registerBatch.farm")}</label>
          {farms.length > 0 && (
            <select
              className="input mb-2"
              value={form.farm_name}
              onChange={(e) => update("farm_name", e.target.value)}
            >
              <option value="">{t("registerBatch.newFarm")}</option>
              {farms.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          )}
          <input
            className="input"
            value={form.farm_name}
            onChange={(e) => update("farm_name", e.target.value)}
            placeholder={t("registerBatch.farmNamePlaceholder")}
            required
          />
        </div>

        <div>
          <label className="label">{t("registerBatch.description")}</label>
          <textarea
            className="input"
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder={t("registerBatch.descriptionPlaceholder")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label">{t("registerBatch.totalQty")}</label>
            <input
              type="number"
              min="1"
              className="input"
              value={form.quantity_kg}
              onChange={(e) => update("quantity_kg", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">{t("registerBatch.pricePerShare")}</label>
            <input
              type="number"
              min="1"
              className="input"
              value={form.price_per_share}
              onChange={(e) => update("price_per_share", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">{t("registerBatch.shareSize")}</label>
            <input
              type="number"
              min="1"
              className="input"
              value={form.share_size_kg}
              onChange={(e) => update("share_size_kg", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">{t("registerBatch.plantedDate")}</label>
            <input
              type="date"
              className="input"
              value={form.planted_date}
              onChange={(e) => update("planted_date", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">{t("registerBatch.harvestDate")}</label>
            <input
              type="date"
              className="input"
              value={form.expected_harvest_date}
              onChange={(e) => update("expected_harvest_date", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="label">{t("registerBatch.photoUrl")}</label>
          <input
            className="input"
            dir="ltr"
            value={form.photo_url}
            onChange={(e) => update("photo_url", e.target.value)}
            placeholder="https://images.unsplash.com/…"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button className="btn-primary" disabled={loading}>
          {loading ? t("registerBatch.registering") : t("registerBatch.submit")}
        </button>
      </form>
    </div>
  );
}
