"""Lightweight per-request localisation for user-facing model text.

The client sends ``?lang=ar`` (or an ``Accept-Language: ar`` header); serializers
use :class:`LocalizedField` to return the ``*_ar`` column when it is populated,
falling back to the base (English) column otherwise.
"""
from rest_framework import serializers

SUPPORTED_LANGS = {"en", "ar"}
DEFAULT_LANG = "en"


def resolve_lang(request) -> str:
    if request is None:
        return DEFAULT_LANG
    q = request.query_params.get("lang") or request.query_params.get("language")
    if q in SUPPORTED_LANGS:
        return q
    accept = request.headers.get("Accept-Language", "")
    return "ar" if accept[:2].lower() == "ar" else DEFAULT_LANG


class LocalizedField(serializers.Field):
    """Read-only field returning ``<name>`` or ``<name>_ar`` per request language.

    Pass ``source="*"`` when the localised attribute lives on the object being
    serialized, or ``source="farm"`` (etc.) to read it off a related object.
    """

    def __init__(self, field_name, **kwargs):
        self._loc_field = field_name
        kwargs.setdefault("read_only", True)
        super().__init__(**kwargs)

    def to_representation(self, value):
        base = getattr(value, self._loc_field, "") or ""
        if resolve_lang(self.context.get("request")) == "ar":
            ar = getattr(value, f"{self._loc_field}_ar", "") or ""
            return ar or base
        return base
