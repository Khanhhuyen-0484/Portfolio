from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "cv"
PDF_PATH = OUT / "Khanh_Huyen_UIUX_CV_Vietnamese.pdf"

FONT_PATH = Path("C:/Windows/Fonts/arial.ttf")
BOLD_FONT_PATH = Path("C:/Windows/Fonts/arialbd.ttf")
pdfmetrics.registerFont(TTFont("ArialVN", str(FONT_PATH)))
pdfmetrics.registerFont(TTFont("ArialVNBold", str(BOLD_FONT_PATH)))

W, H = letter
M = 0.42 * inch
SIDEBAR_W = 2.02 * inch
GAP = 0.24 * inch
MAIN_X = M + SIDEBAR_W + GAP
MAIN_W = W - MAIN_X - M

NAVY = colors.HexColor("#101828")
BLUE = colors.HexColor("#2563EB")
GRAY = colors.HexColor("#667085")
LIGHT_BLUE = colors.HexColor("#EFF6FF")
LINE = colors.HexColor("#D0D5DD")


def font_name(bold=False):
    return "ArialVNBold" if bold else "ArialVN"


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
    font = font_name(bold)
    c.setFont(font, size)
    c.setFillColor(color)
    lines = wrap_text(text, font, size, width) if width else text.split("\n")
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def heading(c, x, y, text):
    c.setFillColor(BLUE)
    c.setFont(font_name(True), 8.6)
    c.drawString(x, y, text.upper())
    c.setStrokeColor(colors.HexColor("#C7D2FE"))
    c.setLineWidth(0.7)
    c.line(x, y - 4, x + 1.25 * inch, y - 4)
    return y - 16


def bullet(c, x, y, text, width, size=8.15, leading=9.8):
    c.setFillColor(BLUE)
    c.circle(x + 2, y + 2.5, 1.4, fill=1, stroke=0)
    y = draw_text(c, x + 10, y, text, size=size, color=NAVY, leading=leading, width=width - 10)
    return y - 2


def sidebar_bullet(c, x, y, text):
    c.setFillColor(BLUE)
    c.circle(x + 2, y + 2.5, 1.2, fill=1, stroke=0)
    return draw_text(c, x + 9, y, text, size=7.85, color=NAVY, leading=9.5, width=SIDEBAR_W - 0.34 * inch) - 1.5


def project(c, x, y, title, bullets):
    y = draw_text(c, x, y, title, size=9.55, color=NAVY, bold=True, leading=11.2, width=MAIN_W)
    for item in bullets:
        y = bullet(c, x, y + 1, item, MAIN_W, size=8.0, leading=9.5)
    return y - 3


def build():
    c = canvas.Canvas(str(PDF_PATH), pagesize=letter)
    c.setTitle("CV Khanh Huyen UIUX")

    c.setFillColor(LIGHT_BLUE)
    c.roundRect(M, M, SIDEBAR_W, H - 2 * M, 14, fill=1, stroke=0)
    c.setFillColor(BLUE)
    c.roundRect(M + 0.18 * inch, H - M - 0.48 * inch, 0.5 * inch, 0.08 * inch, 4, fill=1, stroke=0)

    lx = M + 0.18 * inch
    ly = H - M - 0.78 * inch
    ly = draw_text(c, lx, ly, "KHÁNH\nHUYỀN", size=20, color=NAVY, bold=True, leading=21)
    ly = draw_text(c, lx, ly - 2, "THỰC TẬP SINH UI/UX DESIGN", size=7.65, color=BLUE, bold=True, leading=10)
    ly -= 8
    for line in [
        "TP. Hồ Chí Minh, Việt Nam",
        "tkhanhhuyen0484@gmail.com",
        "Portfolio: thêm link public",
        "SĐT: thêm số điện thoại",
    ]:
        ly = draw_text(c, lx, ly, line, size=7.75, color=NAVY, leading=9.4, width=SIDEBAR_W - 0.35 * inch)
    ly -= 8

    ly = heading(c, lx, ly, "Kỹ năng chính")
    for skill in [
        "Thiết kế UI Mobile App",
        "User Flow & Wireframe",
        "Prototype high-fidelity",
        "Phân cấp thị giác",
        "Design System",
        "Responsive Web Design",
        "Usability Testing",
        "Bàn giao cho Developer",
    ]:
        ly = sidebar_bullet(c, lx, ly, skill)
    ly -= 7

    ly = heading(c, lx, ly, "Công cụ")
    for tool in ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Framer", "Webflow"]:
        ly = sidebar_bullet(c, lx, ly, tool)
    ly -= 7

    ly = heading(c, lx, ly, "Lập trình")
    for dev in ["HTML/CSS", "JavaScript", "React", "Tailwind CSS", "Git"]:
        ly = sidebar_bullet(c, lx, ly, dev)
    ly -= 7

    ly = heading(c, lx, ly, "Học vấn")
    ly = draw_text(c, lx, ly, "Đại học Công nghiệp TP. Hồ Chí Minh", size=7.85, color=NAVY, bold=True, leading=9.5, width=SIDEBAR_W - 0.34 * inch)
    draw_text(c, lx, ly - 1, "Sinh viên năm 4 - Công nghệ thông tin", size=7.6, color=GRAY, leading=9.2, width=SIDEBAR_W - 0.34 * inch)

    x = MAIN_X
    y = H - M - 0.18 * inch
    y = draw_text(c, x, y, "Khánh Huyền", size=25, color=NAVY, bold=True, leading=27)
    y = draw_text(c, x, y - 2, "UI/UX Designer tập trung vào trải nghiệm mobile chỉn chu", size=10.0, color=BLUE, bold=True, leading=13, width=MAIN_W)
    y -= 6
    y = draw_text(
        c,
        x,
        y,
        "Sinh viên năm 4 ngành Công nghệ thông tin và Thực tập sinh UI/UX Design tại TP. Hồ Chí Minh. Tôi thiết kế mobile app, website và luồng sản phẩm theo hướng rõ ràng, dễ dùng và có tính thẩm mỹ. Portfolio hiện tập trung vào các trải nghiệm thực tế như camera app, AI note, parental control, e-commerce và entertainment app.",
        size=8.55,
        color=NAVY,
        leading=11,
        width=MAIN_W,
    )
    y -= 7

    y = heading(c, x, y, "Dự án tiêu biểu")
    y = project(c, x, y, "KidGuard App - Ứng dụng quản lý thiết bị trẻ em", [
        "Thiết kế luồng parent/child cho screen time, giới hạn app, setup thiết bị và trạng thái lock.",
        "Xây dựng visual system thân thiện với tông xanh, mềm mại và phù hợp chủ đề family safety.",
    ])
    y = project(c, x, y, "AI Voice Lock: Smart Note - Ứng dụng ghi chú bảo mật", [
        "Thiết kế voice lock, danh sách AI note, onboarding, setup và màn preview nội dung riêng tư.",
        "Tạo giao diện bảo mật với permission rõ ràng, nhiều lock mode và thao tác summary dễ hiểu.",
    ])
    y = project(c, x, y, "Ultra Camera - Ứng dụng camera mobile", [
        "Thiết kế luồng chụp ảnh, gallery, onboarding và chỉnh sửa ảnh cho trải nghiệm camera chuyên nghiệp.",
        "Áp dụng UI system màu tím sạch, nhấn mạnh hành động chính và các control chỉnh ảnh.",
    ])
    y = project(c, x, y, "ELOGI - Ứng dụng e-commerce mobile", [
        "Thiết kế product discovery, search, product detail, chat, notification và delivery tracking.",
        "Tạo trải nghiệm mua sắm mobile rõ ràng với CTA nổi bật và component nhất quán.",
    ])
    y = project(c, x, y, "Prank Sound - Ứng dụng giải trí mobile", [
        "Thiết kế trải nghiệm vui nhộn để duyệt và phát các hiệu ứng âm thanh prank.",
        "Tổ chức category, player action và rating flow thành giao diện đậm màu, dễ thao tác.",
    ])

    y = heading(c, x, y - 2, "Kinh nghiệm & thế mạnh")
    for item in [
        "Thiết kế màn hình mobile từ research, user flow, wireframe đến high-fidelity UI.",
        "Sử dụng spacing, typography, màu sắc và component consistency để giao diện rõ ràng, cao cấp.",
        "Chuẩn bị screen, state và UI pattern có tổ chức để hỗ trợ developer handoff.",
    ]:
        y = bullet(c, x, y, item, MAIN_W, size=8.0, leading=9.5)

    y = heading(c, x, y - 1, "Từ khóa hồ sơ")
    draw_text(
        c,
        x,
        y,
        "UI/UX Design - Product Design - Mobile App Design - Figma - Prototyping - User Flow - Visual Design - Design Systems",
        size=7.95,
        color=GRAY,
        leading=9.5,
        width=MAIN_W,
    )

    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(M, M + 0.2 * inch, W - M, M + 0.2 * inch)
    c.setFillColor(GRAY)
    c.setFont(font_name(False), 7.5)
    c.drawCentredString(W / 2, M + 0.08 * inch, "Khánh Huyền - Thực tập sinh UI/UX Design")
    c.save()
    print(PDF_PATH)


if __name__ == "__main__":
    build()
