from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "cv"
OUT.mkdir(exist_ok=True)
PDF_PATH = OUT / "Khanh_Huyen_UIUX_CV.pdf"

W, H = letter
M = 0.42 * inch
SIDEBAR_W = 2.02 * inch
GAP = 0.24 * inch
MAIN_X = M + SIDEBAR_W + GAP
MAIN_W = W - MAIN_X - M

NAVY = colors.HexColor("#101828")
BLUE = colors.HexColor("#2563EB")
CYAN = colors.HexColor("#0EA5E9")
GRAY = colors.HexColor("#667085")
LIGHT_BLUE = colors.HexColor("#EFF6FF")
PALE = colors.HexColor("#F8FAFC")
LINE = colors.HexColor("#D0D5DD")
WHITE = colors.white


def wrap_text(text, font, size, width):
    words = text.split()
    lines = []
    line = ""
    for word in words:
        candidate = word if not line else f"{line} {word}"
        if stringWidth(candidate, font, size) <= width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def draw_text(c, x, y, text, size=9, color=NAVY, bold=False, leading=11, width=None):
    font = "Helvetica-Bold" if bold else "Helvetica"
    c.setFont(font, size)
    c.setFillColor(color)
    lines = wrap_text(text, font, size, width) if width else text.split("\n")
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def heading(c, x, y, text, color=BLUE):
    c.setFillColor(color)
    c.setFont("Helvetica-Bold", 8.6)
    c.drawString(x, y, text.upper())
    c.setStrokeColor(colors.HexColor("#C7D2FE"))
    c.setLineWidth(0.7)
    c.line(x, y - 4, x + 1.25 * inch, y - 4)
    return y - 16


def bullet(c, x, y, text, width, size=8.2, leading=10.2):
    c.setFillColor(BLUE)
    c.circle(x + 2, y + 2.5, 1.4, fill=1, stroke=0)
    y = draw_text(c, x + 10, y, text, size=size, color=NAVY, leading=leading, width=width - 10)
    return y - 2


def sidebar_bullet(c, x, y, text):
    c.setFillColor(BLUE)
    c.circle(x + 2, y + 2.5, 1.2, fill=1, stroke=0)
    return draw_text(c, x + 9, y, text, size=7.85, color=NAVY, leading=9.5, width=SIDEBAR_W - 0.34 * inch) - 1.5


def project(c, x, y, title, bullets):
    y = draw_text(c, x, y, title, size=9.8, color=NAVY, bold=True, leading=11.6, width=MAIN_W)
    for item in bullets:
        y = bullet(c, x, y + 1, item, MAIN_W, size=8.15, leading=9.8)
    return y - 3


def build():
    c = canvas.Canvas(str(PDF_PATH), pagesize=letter)
    c.setTitle("Khanh Huyen UIUX CV")

    # Sidebar background and subtle top accent.
    c.setFillColor(LIGHT_BLUE)
    c.roundRect(M, M, SIDEBAR_W, H - 2 * M, 14, fill=1, stroke=0)
    c.setFillColor(BLUE)
    c.roundRect(M + 0.18 * inch, H - M - 0.48 * inch, 0.5 * inch, 0.08 * inch, 4, fill=1, stroke=0)

    lx = M + 0.18 * inch
    ly = H - M - 0.78 * inch
    ly = draw_text(c, lx, ly, "KHANH\nHUYEN", size=20, color=NAVY, bold=True, leading=21)
    ly = draw_text(c, lx, ly - 2, "UI/UX DESIGNER INTERN", size=7.8, color=BLUE, bold=True, leading=10)
    ly -= 8
    for line in [
        "Ho Chi Minh City, Vietnam",
        "tkhanhhuyen0484@gmail.com",
        "Portfolio: add public link",
        "Phone: add phone number",
    ]:
        ly = draw_text(c, lx, ly, line, size=7.75, color=NAVY, leading=9.4, width=SIDEBAR_W - 0.35 * inch)
    ly -= 8

    ly = heading(c, lx, ly, "Core Skills")
    for skill in [
        "Mobile App UI Design",
        "User Flow & Wireframing",
        "High-fidelity Prototyping",
        "Visual Hierarchy",
        "Design Systems",
        "Responsive Web Design",
        "Usability Testing",
        "Developer Handoff",
    ]:
        ly = sidebar_bullet(c, lx, ly, skill)
    ly -= 7

    ly = heading(c, lx, ly, "Tools")
    for tool in ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Framer", "Webflow"]:
        ly = sidebar_bullet(c, lx, ly, tool)
    ly -= 7

    ly = heading(c, lx, ly, "Development")
    for dev in ["HTML/CSS", "JavaScript", "React", "Tailwind CSS", "Git"]:
        ly = sidebar_bullet(c, lx, ly, dev)
    ly -= 7

    ly = heading(c, lx, ly, "Education")
    ly = draw_text(c, lx, ly, "Industrial University of Ho Chi Minh City", size=7.85, color=NAVY, bold=True, leading=9.5, width=SIDEBAR_W - 0.34 * inch)
    draw_text(c, lx, ly - 1, "Information Technology - 4th-year student", size=7.6, color=GRAY, leading=9.2, width=SIDEBAR_W - 0.34 * inch)

    # Main content.
    x = MAIN_X
    y = H - M - 0.18 * inch
    y = draw_text(c, x, y, "Khanh Huyen", size=25, color=NAVY, bold=True, leading=27)
    y = draw_text(c, x, y - 2, "UI/UX Designer focused on polished mobile experiences", size=10.2, color=BLUE, bold=True, leading=13, width=MAIN_W)
    y -= 6
    y = draw_text(
        c,
        x,
        y,
        "4th-year IT student and UI/UX Design Intern based in Ho Chi Minh City. I design mobile apps, websites and product flows that feel clear, polished and easy to use. My portfolio focuses on practical app experiences across camera, AI notes, parental control, e-commerce and entertainment products.",
        size=8.75,
        color=NAVY,
        leading=11.2,
        width=MAIN_W,
    )
    y -= 7

    y = heading(c, x, y, "Selected Projects")
    y = project(c, x, y, "KidGuard App - Parental Control Mobile App", [
        "Designed parent and child flows for screen time, app access, setup and lock states.",
        "Created a friendly visual system using soft blue, green and safety-focused UI patterns.",
    ])
    y = project(c, x, y, "AI Voice Lock: Smart Note - Secure Notes App", [
        "Designed voice lock, AI note list, onboarding, setup and private preview flows.",
        "Built a security-focused interface with clear permissions, lock modes and summary actions.",
    ])
    y = project(c, x, y, "Ultra Camera - Mobile Camera App", [
        "Designed capture, gallery, onboarding and photo editing screens for a pro camera flow.",
        "Applied a clean purple UI system with clear primary actions and editing controls.",
    ])
    y = project(c, x, y, "ELOGI - Mobile E-commerce App", [
        "Designed product discovery, search, product detail, chat, notification and delivery tracking screens.",
        "Created a clean mobile shopping experience with strong CTA hierarchy and consistent components.",
    ])
    y = project(c, x, y, "Prank Sound - Mobile Entertainment App", [
        "Designed a playful app experience for browsing and playing prank sound effects.",
        "Organized sound categories, player actions and rating moments into a bold, easy-to-tap UI.",
    ])

    y = heading(c, x, y - 2, "Experience & Strengths")
    for item in [
        "Create user-centered mobile screens from research, user flow and wireframe through high-fidelity UI.",
        "Use spacing, typography, color and component consistency to make interfaces feel calm and premium.",
        "Prepare organized screens, states and reusable UI patterns for smoother developer handoff.",
    ]:
        y = bullet(c, x, y, item, MAIN_W, size=8.2, leading=9.8)

    y = heading(c, x, y - 1, "Profile Keywords")
    draw_text(
        c,
        x,
        y,
        "UI/UX Design - Product Design - Mobile App Design - Figma - Prototyping - User Flow - Visual Design - Design Systems",
        size=8.0,
        color=GRAY,
        leading=9.5,
        width=MAIN_W,
    )

    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(M, M + 0.2 * inch, W - M, M + 0.2 * inch)
    c.setFillColor(GRAY)
    c.setFont("Helvetica", 7.5)
    c.drawCentredString(W / 2, M + 0.08 * inch, "Khanh Huyen - UI/UX Designer Intern")
    c.save()
    print(PDF_PATH)


if __name__ == "__main__":
    build()
