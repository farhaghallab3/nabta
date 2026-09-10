import base64
from io import BytesIO

import qrcode


def qr_data_uri(payload: str) -> str:
    """Return a base64 PNG data URI encoding ``payload`` — handy for the API/UI."""
    img = qrcode.make(payload, box_size=8, border=2)
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/png;base64,{encoded}"
