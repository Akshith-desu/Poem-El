# 🚀 Dynamic Pricing Simulator

**Interpretable Simulation-Based Analysis of Pricing Decisions Under Demand Elasticity Uncertainty**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production-brightgreen)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Research Background](#research-background)
- [Technical Stack](#technical-stack)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

---

## 🎯 Overview

The **Dynamic Pricing Simulator** is a comprehensive web-based application designed for analyzing pricing strategies under demand elasticity uncertainty. This project bridges economic theory with computational decision support, providing transparent insights into pricing mechanisms unlike black-box machine learning approaches.

### Key Objectives:

- ✅ Simulate dynamic vs fixed pricing strategies
- ✅ Analyze market structures (Perfect Competition, Monopoly, Oligopoly)
- ✅ Evaluate price discrimination strategies
- ✅ Conduct Monte Carlo risk simulations
- ✅ Compare elasticity scenarios

---

## ✨ Features

### 1. **Dynamic Pricing Simulator**

- Real-time pricing optimization
- Revenue vs Profit maximization
- Elasticity-based demand modeling
- Interactive price-demand curves

### 2. **Elasticity Comparison Analysis**

- Cross-elasticity scenario testing
- Revenue gain calculations
- Optimal price point identification
- Visual comparison charts

### 3. **Market Structure Analysis**

- **Perfect Competition**: P = MC equilibrium
- **Monopoly**: MR = MC optimization with deadweight loss
- **Oligopoly**: Cournot duopoly model
- Consumer & Producer Surplus calculations

### 4. **Price Discrimination Module**

- **Third-Degree**: Market segmentation (Premium vs Value)
- **Second-Degree**: Quantity discount tiers
- Revenue improvement tracking
- Segment-wise breakdown analysis

### 5. **Monte Carlo Risk Simulation**

- 100-10,000 simulation runs
- Demand & elasticity uncertainty modeling
- Value at Risk (VaR) calculations
- Confidence interval analysis (95%, 99%)
- Risk level assessment (Low/Moderate/High)

### 6. **Research Insights**

- Key findings from experimental validation
- Practical business implications
- Theoretical contributions
- Limitations and future directions

### 7. **Export Functionality**

- JSON export of all results
- Complete parameter tracking
- Timestamp logging

---

## 🛠️ Installation

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely client-side!

### Setup Steps

1. **Download the project files:**

```bash
git clone https://github.com/yourusername/dynamic-pricing-simulator.git
cd dynamic-pricing-simulator
```

2. **Project files:**

```
dynamic-pricing-simulator/
├── index.html          # Main HTML file
├── styles.css          # Modern grey gradient CSS
├── script.js           # Complete JavaScript logic
└── README.md           # This file
```

3. **Run the application:**
   - Simply open `index.html` in your web browser
   - No build process or dependencies required!

---

## 📖 Usage Guide

### Basic Workflow

#### **Step 1: Set Parameters**

Navigate to the **Simulator** tab and configure:

- **Base Price (p₀)**: Reference price point (default: ₹100)
- **Base Demand (q₀)**: Quantity at base price (default: 1000 units)
- **Price Elasticity (ε)**: Demand responsiveness (-3 to -0.1)
- **Unit Cost (c)**: Marginal cost per unit (default: ₹40)
- **Pricing Strategy**: Fixed or Dynamic

#### **Step 2: Calculate Results**

- Click **Calculate** to see optimal pricing
- View revenue and profit optimization
- Analyze demand curves

#### **Step 3: Run Comparisons**

- Click **Run Elasticity Comparison**
- Compare performance across elasticity values (-0.5 to -2.5)
- View revenue gains and optimal prices

#### **Step 4: Explore Market Structures**

Navigate to **Market Structures** tab:

- Select market type (Perfect/Monopoly/Oligopoly)
- Adjust demand parameters
- Analyze consumer/producer surplus

#### **Step 5: Test Price Discrimination**

Navigate to **Price Discrimination** tab:

- Choose discrimination type
- Configure segment parameters
- Compare with uniform pricing

#### **Step 6: Assess Risk**

Navigate to **Monte Carlo Risk** tab:

- Set number of simulations (100-10,000)
- Configure uncertainty parameters
- View VaR and confidence intervals

#### **Step 7: Export Data**

- Click **Export Results (JSON)** on Simulator tab
- Save complete analysis for reporting

---

---

## 🔬 Research Background

### Economic Model

**Constant Elasticity Demand Function:**

```
q(p) = q₀ × (p/p₀)^ε
```

**Revenue Function:**

```
R(p) = p × q(p)
```

**Profit Function:**

```
Π(p) = R(p) - c × q(p) = (p - c) × q(p)
```

### Key Findings

1. **Dynamic Pricing Advantage**: 18-23% revenue improvement in elastic markets (|ε| > 1)
2. **Revenue vs Profit Tradeoff**: Profit-optimal prices typically 5-15% higher
3. **Elasticity Sensitivity**: ±0.2 estimation error leads to 8-12% suboptimal decisions
4. **Market Structure Impact**: Monopoly prices 40-60% higher than perfect competition

### Research Paper

This simulator is based on the research paper:
**"Interpretable Simulation-Based Analysis of Dynamic Pricing Decisions Under Demand Elasticity Uncertainty"**

- Institution: RV College of Engineering
- Department: Computer Science and Engineering
- Course: Principles of Economics and Management (POME)

---

## 💻 Technical Stack

| Technology           | Purpose                             |
| -------------------- | ----------------------------------- |
| **HTML5**            | Application structure               |
| **CSS3**             | Modern grey gradient UI, animations |
| **JavaScript (ES6)** | Core logic, calculations            |
| **Plotly.js**        | Interactive data visualizations     |
| **No Backend**       | Pure client-side application        |

### Libraries Used

- **Plotly.js 2.26.0**: For all charts and graphs
- **Native JavaScript**: All calculations and logic

### Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 📸 Screenshots

### Simulator Tab

- Real-time pricing optimization
- Revenue and profit curves
- Optimal price identification

### Market Structures Tab

- Supply & demand equilibrium
- Consumer/producer surplus
- Deadweight loss visualization

### Monte Carlo Risk Tab

- Revenue distribution histogram
- Cumulative distribution function
- Percentile risk analysis

---

## 🎨 Design Philosophy

### Modern Grey Gradient Theme

- **Professional**: Dark grey gradients (#1e1e1e → #3a3a3a)
- **Minimalist**: Clean, distraction-free interface
- **Accessible**: High contrast for readability
- **Responsive**: Mobile-first design approach

### UI/UX Principles

1. **Clarity**: Clear labeling and intuitive navigation
2. **Feedback**: Hover effects and animations
3. **Efficiency**: Minimal clicks to insights
4. **Consistency**: Uniform design language

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Future Enhancements

- [ ] Multi-product portfolio pricing
- [ ] Time-varying elasticity models
- [ ] Machine learning demand estimation
- [ ] Game-theoretic competitor analysis
- [ ] Real-time data integration
- [ ] Advanced statistical testing

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Research Team - RV College of Engineering**

- **Aryaki** - aryaki.cs23@rvce.edu.in
- **Anshika Prashanth** - anshikaprashanth.cs23@rvce.edu.in
- **Akshith Desu** - akshithdesu.cs23@rvce.edu.in
- **Anirudh Kulkarni** - anirudhkulkarni.cs23@rvce.edu.in

**Faculty Advisor:**

- **Dr. Manas M N** (Associate Professor) - manasmn@rvce.edu.in

---

## 🙏 Acknowledgments

- RV College of Engineering for research support
- Department of Computer Science and Engineering
- Principles of Economics and Management course
- Plotly.js team for visualization library

---

## 📞 Contact

For questions, suggestions, or collaboration:

- 📧 Email: aryaki.cs23@rvce.edu.in
- 🏫 Institution: RV College of Engineering, Bengaluru
- 📍 Location: Bengaluru, Karnataka, India

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐!

---

**Built with ❤️ for economic analysis and management decision-making**

_Last Updated: January 2026_
