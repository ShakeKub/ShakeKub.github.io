# Blackjack Strategy Advisor

A modern, responsive web application that helps players make optimal decisions in blackjack using mathematically proven basic strategy. Built with vanilla HTML, CSS, and JavaScript.

## Features

- **Real-time Strategy Recommendations**: Get instant advice on whether to hit, stand, double down, or split
- **Split Hand Management**: Handle split pairs with individual card tracking for each hand
- **Manual Card Addition**: Add additional cards to any hand and see updated strategy recommendations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Windows 11-inspired UI**: Clean, modern interface with glassmorphism effects
- **Interactive Help System**: Comprehensive guide for new players

## How to Use

1. **Select Your Cards**: Choose your two starting cards from the dropdown menus
2. **Set Dealer's Card**: Select the dealer's visible up card
3. **Get Strategy**: The optimal play recommendation appears automatically
4. **Handle Splits**: When you have a pair, you can split and manage each hand separately
5. **Add Cards**: Use the "Hit" option to add cards and see updated recommendations

## Strategy Logic

The application implements mathematically optimal basic strategy based on:
- **Hard Hands**: Hands without aces or where aces count as 1
- **Soft Hands**: Hands with aces counting as 11
- **Pairs**: Identical cards that can potentially be split

All recommendations are based on probability calculations that minimize the house edge.

## Technical Details

- **Frontend**: Pure HTML5, CSS3, and ES6 JavaScript
- **Styling**: CSS Grid and Flexbox for responsive layouts
- **Animations**: Smooth CSS transitions and keyframe animations
- **Compatibility**: Works in all modern browsers

## File Structure

```
BJ-Strategy/
├── index.html          # Main application file
├── style.css           # Styling and responsive design
├── script.js           # Game logic and strategy calculations
└── README.md           # This file
```

## Getting Started

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Start playing and improving your blackjack strategy

No additional setup or dependencies required.

## Strategy Recommendations

The app provides four main types of recommendations:

- **Hit**: Take another card
- **Stand**: Keep your current hand
- **Double Down**: Double your bet and take exactly one more card
- **Split**: Separate your pair into two hands (when applicable)

## Browser Support

Works in all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

This is a standalone educational tool. Feel free to fork and modify for your own use.

## Disclaimer

This tool is for educational purposes only. Gambling involves risk, and no strategy can guarantee winning. Always gamble responsibly and within your means.
