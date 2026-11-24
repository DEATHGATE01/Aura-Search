"""Generate sample PDFs for testing"""
from pathlib import Path
from fpdf import FPDF

PDF_DIR = Path("./pdfs")
PDF_DIR.mkdir(exist_ok=True)

# Create doc1.pdf - Q4 Financial Report
pdf1 = FPDF()
pdf1.add_page()
pdf1.set_font("Helvetica", "B", 24)
pdf1.cell(0, 20, "Q4 Financial Report 2024", ln=True, align="C")
pdf1.set_font("Helvetica", "", 12)
pdf1.ln(10)
pdf1.multi_cell(0, 10, """
Executive Summary

This quarterly report presents the financial performance for Q4 2024.
Key highlights include strong revenue growth and improved operational efficiency.
""")

pdf1.add_page()
pdf1.set_font("Helvetica", "B", 16)
pdf1.cell(0, 15, "Financial Highlights", ln=True)
pdf1.set_font("Helvetica", "", 12)
pdf1.multi_cell(0, 10, """
Revenue Performance:
- Total revenue: $45.2 million
- Year-over-year growth: 23%
- Quarterly growth: 8%

The company achieved record revenue this quarter, driven by strong
performance in our core product lines and successful expansion into
new markets.
""")

pdf1.add_page()
pdf1.set_font("Helvetica", "B", 16)
pdf1.cell(0, 15, "Q4 Key Metrics", ln=True)
pdf1.set_font("Helvetica", "", 12)
pdf1.multi_cell(0, 10, """
Detailed Analysis:

Our analysis shows that revenue increased by 15% in Q4 compared to Q3.
This growth was primarily driven by:

1. New customer acquisition (+2,500 customers)
2. Expansion of existing accounts (+18% upsell rate)
3. Launch of premium tier subscription
4. International market expansion

The strong performance exceeded analyst expectations and positions
the company well for continued growth in 2025.
""")

pdf1.output(PDF_DIR / "doc1.pdf")
print("Created doc1.pdf - Q4 Financial Report (3 pages)")

# Create doc2.pdf - Market Analysis
pdf2 = FPDF()
pdf2.add_page()
pdf2.set_font("Helvetica", "B", 24)
pdf2.cell(0, 20, "Market Analysis Report", ln=True, align="C")
pdf2.set_font("Helvetica", "", 12)
pdf2.ln(10)
pdf2.multi_cell(0, 10, """
Industry Overview

This report provides a comprehensive analysis of market trends and
competitive landscape for the technology sector in 2024.

Key findings suggest continued growth in 2024 with opportunities
in emerging markets and AI-driven solutions.
""")

pdf2.add_page()
pdf2.set_font("Helvetica", "B", 16)
pdf2.cell(0, 15, "Market Trends", ln=True)
pdf2.set_font("Helvetica", "", 12)
pdf2.multi_cell(0, 10, """
Current Trends:

1. AI Integration: Companies are rapidly adopting AI solutions
2. Cloud Migration: Continued shift to cloud-based services
3. Sustainability: Growing focus on green technology
4. Remote Work: Hybrid models becoming standard

Market projections indicate continued growth in 2024, with the
technology sector expected to grow 12% year-over-year.
""")

pdf2.output(PDF_DIR / "doc2.pdf")
print("Created doc2.pdf - Market Analysis (2 pages)")

print("\nSample PDFs created successfully in ./pdfs/")
print("Restart the backend to load them.")
