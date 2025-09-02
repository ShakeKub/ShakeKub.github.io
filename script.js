// Blackjack Strategy Advisor JavaScript
class BlackjackStrategyAdvisor {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.strategyChart = this.createStrategyChart();
        this.currentHands = [];
        this.isSplit = false;
    }

    initializeElements() {
        this.playerCard1 = document.getElementById('playerCard1');
        this.playerCard2 = document.getElementById('playerCard2');
        this.dealerCard = document.getElementById('dealerCard');
        this.getStrategyBtn = document.getElementById('getStrategyBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.strategyResult = document.getElementById('strategyResult');
        this.playerCards = document.getElementById('playerCards');
        this.dealerCards = document.getElementById('dealerCards');
        this.splitHandsContainer = document.getElementById('splitHandsContainer');
        this.infoBtn = document.getElementById('infoBtn');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modalClose = document.getElementById('modalClose');
        this.mainContainer = document.getElementById('mainContainer');
        this.hitCardInput = document.getElementById('hitCardInput');
        this.hitCard = document.getElementById('hitCard');
        this.addHitCardBtn = document.getElementById('addHitCard');
        this.loadingAnimation = document.getElementById('loadingAnimation');
        
        // Split hand elements
        this.splitHand1Card = document.getElementById('splitHand1Card');
        this.splitHand2Card = document.getElementById('splitHand2Card');
        this.addSplitHand1CardBtn = document.getElementById('addSplitHand1Card');
        this.addSplitHand2CardBtn = document.getElementById('addSplitHand2Card');
        this.splitHand1Cards = [];
        this.splitHand2Cards = [];
    }

    bindEvents() {
        // Button events
        this.getStrategyBtn.addEventListener('click', () => this.getStrategy());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.addHitCardBtn.addEventListener('click', () => this.addManualHitCard());
        this.addSplitHand1CardBtn.addEventListener('click', () => this.addSplitCard(1));
        this.addSplitHand2CardBtn.addEventListener('click', () => this.addSplitCard(2));
        
        // Card selection events
        this.playerCard1.addEventListener('change', () => {
            this.updatePlayerCards();
            this.autoShowStrategy();
        });
        this.playerCard2.addEventListener('change', () => {
            this.updatePlayerCards();
            this.autoShowStrategy();
        });
        this.dealerCard.addEventListener('change', () => {
            this.updateDealerCard();
            this.autoShowStrategy();
        });
        
        // Modal events
        this.infoBtn.addEventListener('click', () => this.showModal());
        this.modalClose.addEventListener('click', () => this.hideModal());
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) this.hideModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.reset();
            }
            if (e.key === 'Escape') {
                this.hideModal();
            }
        });
        
        // Add animation on page load
        setTimeout(() => {
            this.mainContainer.style.opacity = '1';
        }, 100);
        
        // Hide loading animation after cards are dealt
        this.hideLoadingAnimation();
    }

    hideLoadingAnimation() {
        // Wait for all cards to be dealt (last card at 1.0s + 0.6s animation)
        setTimeout(() => {
            if (this.loadingAnimation) {
                this.loadingAnimation.classList.add('fade-out');
                // Show main container
                this.mainContainer.classList.add('show');
                // Remove loading from DOM after fade out
                setTimeout(() => {
                    if (this.loadingAnimation && this.loadingAnimation.parentNode) {
                        this.loadingAnimation.parentNode.removeChild(this.loadingAnimation);
                    }
                }, 500);
            }
        }, 2000); // 1.6s for dealing + 0.4s extra
    }

    autoShowStrategy() {
        // Automatically show strategy when all cards are selected
        if (this.playerCard1.value && this.playerCard2.value && this.dealerCard.value) {
            // Small delay to allow UI to update
            setTimeout(() => {
                this.getStrategy(null, null, false);
            }, 100);
        } else {
            // Clear strategy if not all cards are selected
            this.clearStrategy();
        }
    }

    createStrategyChart() {
        // Basic Blackjack Strategy Chart
        return {
            // Hard totals (no aces or aces counted as 1)
            hard: {
                5: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                6: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                7: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                8: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                9: { 2: 'H', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                10: { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'H', 'A': 'H' },
                11: { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'D', 'A': 'H' },
                12: { 2: 'H', 3: 'H', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                13: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                14: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                15: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                16: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                17: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
                18: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
                19: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
                20: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
                21: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' }
            },
            // Soft totals (ace counted as 11)
            soft: {
                13: { 2: 'H', 3: 'H', 4: 'H', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                14: { 2: 'H', 3: 'H', 4: 'H', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                15: { 2: 'H', 3: 'H', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                16: { 2: 'H', 3: 'H', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                17: { 2: 'H', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                18: { 2: 'S', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'S', 8: 'S', 9: 'H', 10: 'H', 'A': 'H' },
                19: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
                20: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
                21: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' }
            },
            // Pairs
            pairs: {
                'AA': { 2: 'SP', 3: 'SP', 4: 'SP', 5: 'SP', 6: 'SP', 7: 'SP', 8: 'SP', 9: 'SP', 10: 'SP', 'A': 'SP' },
                '22': { 2: 'H', 3: 'H', 4: 'SP', 5: 'SP', 6: 'SP', 7: 'SP', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                '33': { 2: 'H', 3: 'H', 4: 'SP', 5: 'SP', 6: 'SP', 7: 'SP', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                '44': { 2: 'H', 3: 'H', 4: 'H', 5: 'SP', 6: 'SP', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                '55': { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'H', 'A': 'H' },
                '66': { 2: 'H', 3: 'SP', 4: 'SP', 5: 'SP', 6: 'SP', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                '77': { 2: 'SP', 3: 'SP', 4: 'SP', 5: 'SP', 6: 'SP', 7: 'SP', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
                '88': { 2: 'SP', 3: 'SP', 4: 'SP', 5: 'SP', 6: 'SP', 7: 'SP', 8: 'SP', 9: 'SP', 10: 'SP', 'A': 'SP' },
                '99': { 2: 'SP', 3: 'SP', 4: 'SP', 5: 'SP', 6: 'SP', 7: 'S', 8: 'SP', 9: 'SP', 10: 'S', 'A': 'S' },
                '1010': { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' }
            }
        };
    }

    getCardValue(card) {
        if (card === 'A') return 11;
        if (['J', 'Q', 'K'].includes(card)) return 10;
        return parseInt(card);
    }

    getNormalizedDealerCard(card) {
        if (['J', 'Q', 'K'].includes(card)) return 10;
        return card;
    }

    calculateHandValue(cards) {
        let total = 0;
        let aces = 0;
        
        for (let card of cards) {
            if (card === 'A') {
                aces++;
                total += 11;
            } else if (['J', 'Q', 'K'].includes(card)) {
                total += 10;
            } else {
                total += parseInt(card);
            }
        }
        
        // Adjust for aces
        while (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }
        
        return { total, hasAce: aces > 0 };
    }

    isPair(card1, card2) {
        // Normalize face cards
        const normalizeCard = (card) => {
            if (['J', 'Q', 'K'].includes(card)) return '10';
            return card;
        };
        
        return normalizeCard(card1) === normalizeCard(card2);
    }

    getStrategy(playerCards = null, dealerUpcard = null, showError = true) {
        // Use provided cards or get from selects
        const card1 = playerCards ? playerCards[0] : this.playerCard1.value;
        const card2 = playerCards ? playerCards[1] : this.playerCard2.value;
        const dealer = dealerUpcard || this.dealerCard.value;
        
        if (!card1 || !card2 || !dealer) {
            if (showError) {
                this.showMessage('Please select all cards first!', 'error');
            }
            return;
        }
        
        const cards = [card1, card2];
        const handValue = this.calculateHandValue(cards);
        const dealerCard = this.getNormalizedDealerCard(dealer);
        
        let strategy;
        let handType;
        
        // Check for pairs first
        if (this.isPair(card1, card2)) {
            const pairKey = card1 === 'A' ? 'AA' : 
                           (['J', 'Q', 'K'].includes(card1) ? '1010' : card1 + card1);
            strategy = this.strategyChart.pairs[pairKey][dealerCard];
            handType = 'pair';
        }
        // Check for soft hands (ace counted as 11)
        else if (handValue.hasAce && handValue.total <= 21) {
            strategy = this.strategyChart.soft[handValue.total][dealerCard];
            handType = 'soft';
        }
        // Hard hands
        else {
            const total = Math.min(handValue.total, 21);
            strategy = this.strategyChart.hard[total] ? this.strategyChart.hard[total][dealerCard] : 'S';
            handType = 'hard';
        }
        
        this.displayStrategy(strategy, handValue.total, handType, cards, dealer);
        
        return strategy;
    }

    displayStrategy(strategy, total, handType, cards, dealer) {
        const strategies = {
            'H': { text: 'HIT', class: 'hit', description: 'Take another card' },
            'S': { text: 'STAND', class: 'stand', description: 'Keep your current hand' },
            'D': { text: 'DOUBLE', class: 'double', description: 'Double your bet and take one card' },
            'SP': { text: 'SPLIT', class: 'split', description: 'Split into two hands' }
        };
        
        const strategyInfo = strategies[strategy];
        
        if (strategy === 'SP') {
            this.handleSplit(cards, dealer);
        } else {
            this.strategyResult.innerHTML = `
                <div class="strategy-text">
                    <strong>${strategyInfo.text}</strong>
                    <div class="strategy-description">${strategyInfo.description}</div>
                    <div class="hand-info">Hand Total: ${total} (${handType})</div>
                </div>
            `;
            this.strategyResult.className = `strategy-result ${strategyInfo.class}`;
            
            // Show hit card input for hits
            if (strategy === 'H') {
                this.showHitCardInput(cards);
            } else {
                this.hideHitCardInput();
            }
        }
    }

    showHitCardInput(currentCards) {
        this.hitCardInput.style.display = 'block';
        this.hitCard.value = '';
        this.currentCards = currentCards;
    }

    hideHitCardInput() {
        this.hitCardInput.style.display = 'none';
    }

    addManualHitCard() {
        if (!this.hitCard.value) {
            this.showMessage('Please select a card first!', 'error');
            return;
        }

        const newCard = this.hitCard.value;
        const newCards = [...this.currentCards, newCard];
        const newHandValue = this.calculateHandValue(newCards);
        
        // Add the new card with animation
        const cardElement = this.createCardElement(newCard);
        this.playerCards.appendChild(cardElement);
        
        // Update strategy
        setTimeout(() => {
            this.strategyResult.innerHTML = `
                <div class="strategy-text">
                    <strong>NEW CARD: ${newCard}</strong>
                    <div class="hand-info">New Total: ${newHandValue.total}</div>
                </div>
            `;
            
            if (newHandValue.total > 21) {
                this.strategyResult.innerHTML += `
                    <div class="strategy-text">
                        <strong style="color: #d13438;">BUST!</strong>
                    </div>
                `;
                this.strategyResult.className = 'strategy-result hit';
                this.hideHitCardInput();
            } else {
                // Get new strategy
                const newStrategy = this.getStrategyForHand(newCards, this.dealerCard.value);
                const strategies = {
                    'H': { text: 'HIT', class: 'hit' },
                    'S': { text: 'STAND', class: 'stand' },
                    'D': { text: 'DOUBLE', class: 'double' }
                };
                const strategyInfo = strategies[newStrategy];
                
                this.strategyResult.innerHTML = `
                    <div class="strategy-text">
                        <strong>${strategyInfo.text}</strong>
                        <div class="hand-info">Total: ${newHandValue.total}</div>
                    </div>
                `;
                this.strategyResult.className = `strategy-result ${strategyInfo.class}`;
                
                if (newStrategy === 'H') {
                    this.showHitCardInput(newCards);
                } else {
                    this.hideHitCardInput();
                }
            }
        }, 600);

        // Clear the hit card select
        this.hitCard.value = '';
    }

    addSplitCard(handNumber) {
        const cardSelect = handNumber === 1 ? this.splitHand1Card : this.splitHand2Card;
        const cardsArray = handNumber === 1 ? this.splitHand1Cards : this.splitHand2Cards;
        const cardsContainer = document.getElementById(`splitHand${handNumber}Cards`);
        const strategyContainer = document.getElementById(`splitHand${handNumber}Strategy`);
        
        if (!cardSelect.value) {
            this.showMessage('Please select a card first!', 'error');
            return;
        }

        const newCard = cardSelect.value;
        cardsArray.push(newCard);
        
        // Add the new card with animation
        const cardElement = this.createCardElement(newCard);
        cardsContainer.appendChild(cardElement);
        
        // Update strategy for this hand
        setTimeout(() => {
            const handValue = this.calculateHandValue(cardsArray);
            
            if (handValue.total > 21) {
                strategyContainer.innerHTML = `
                    <div class="strategy-text">
                        <strong style="color: #d13438;">BUST!</strong>
                        <div class="hand-info">Total: ${handValue.total}</div>
                    </div>
                `;
                strategyContainer.className = 'strategy-result hit';
            } else {
                // Get new strategy
                const strategy = this.getStrategyForHand(cardsArray, this.dealerCard.value);
                this.displaySplitStrategy(`splitHand${handNumber}Strategy`, strategy, handValue.total);
            }
        }, 300);

        // Clear the card select
        cardSelect.value = '';
    }

    handleSplit(cards, dealer) {
        this.isSplit = true;
        this.splitHandsContainer.style.display = 'grid';
        
        // Create two hands
        const hand1Cards = [cards[0]];
        const hand2Cards = [cards[1]];
        
        // Display split message
        this.strategyResult.innerHTML = `
            <div class="strategy-text">
                <strong>SPLIT</strong>
                <div class="strategy-description">Split into two separate hands</div>
                <div class="hand-info">Select cards for each hand below</div>
            </div>
        `;
        this.strategyResult.className = 'strategy-result split';
        
        // Display split hands
        this.displaySplitHand('splitHand1Cards', hand1Cards);
        this.displaySplitHand('splitHand2Cards', hand2Cards);
        
        // Hide main hit input and show split message
        this.hideHitCardInput();
        
        // Show info that user needs to manually add cards to each split hand
        this.showMessage('Please add second cards to each split hand manually using the dropdowns above', 'info');
    }

    getStrategyForHand(cards, dealer) {
        const handValue = this.calculateHandValue(cards);
        const dealerCard = this.getNormalizedDealerCard(dealer);
        
        if (handValue.hasAce && handValue.total <= 21) {
            return this.strategyChart.soft[handValue.total][dealerCard];
        } else {
            const total = Math.min(handValue.total, 21);
            return this.strategyChart.hard[total] ? this.strategyChart.hard[total][dealerCard] : 'S';
        }
    }

    displaySplitHand(containerId, cards) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                const cardElement = this.createCardElement(card);
                container.appendChild(cardElement);
            }, index * 300);
        });
    }

    displaySplitStrategy(containerId, strategy, total) {
        const container = document.getElementById(containerId);
        const strategies = {
            'H': { text: 'HIT', class: 'hit' },
            'S': { text: 'STAND', class: 'stand' },
            'D': { text: 'DOUBLE', class: 'double' }
        };
        
        const strategyInfo = strategies[strategy];
        container.innerHTML = `
            <div class="strategy-text">
                <strong>${strategyInfo.text}</strong>
                <div class="hand-info">Total: ${total}</div>
            </div>
        `;
        container.className = `strategy-result ${strategyInfo.class}`;
    }

    dealRandomCard() {
        const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        return cards[Math.floor(Math.random() * cards.length)];
    }

    updatePlayerCards() {
        this.playerCards.innerHTML = '';
        
        if (this.playerCard1.value) {
            const card1 = this.createCardElement(this.playerCard1.value);
            this.playerCards.appendChild(card1);
        }
        
        if (this.playerCard2.value) {
            setTimeout(() => {
                const card2 = this.createCardElement(this.playerCard2.value);
                this.playerCards.appendChild(card2);
            }, 150);
        }
        
        // Clear strategy result when cards change
        this.clearStrategy();
    }

    updateDealerCard() {
        this.dealerCards.innerHTML = '';
        
        if (this.dealerCard.value) {
            const card = this.createCardElement(this.dealerCard.value);
            this.dealerCards.appendChild(card);
        }
        
        // Clear strategy result when dealer card changes
        this.clearStrategy();
    }

    createCardElement(cardValue) {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = cardValue;
        
        // Add red color for hearts and diamonds (represented by face cards)
        if (['A', 'K', 'Q', 'J'].includes(cardValue)) {
            // Randomly assign red or black (in real game, this would be suit-based)
            if (Math.random() > 0.5) {
                card.classList.add('red');
            }
        }
        
        return card;
    }

    clearStrategy() {
        this.strategyResult.innerHTML = '';
        this.strategyResult.className = 'strategy-result';
        this.splitHandsContainer.style.display = 'none';
        this.hideHitCardInput();
        this.isSplit = false;
        
        // Clear split hand arrays
        this.splitHand1Cards = [];
        this.splitHand2Cards = [];
        
        // Clear split hand displays
        const splitHand1Cards = document.getElementById('splitHand1Cards');
        const splitHand2Cards = document.getElementById('splitHand2Cards');
        const splitHand1Strategy = document.getElementById('splitHand1Strategy');
        const splitHand2Strategy = document.getElementById('splitHand2Strategy');
        
        if (splitHand1Cards) splitHand1Cards.innerHTML = '';
        if (splitHand2Cards) splitHand2Cards.innerHTML = '';
        if (splitHand1Strategy) splitHand1Strategy.innerHTML = '';
        if (splitHand2Strategy) splitHand2Strategy.innerHTML = '';
        
        // Clear split card selects
        this.splitHand1Card.value = '';
        this.splitHand2Card.value = '';
    }

    reset() {
        // Reset all selects to empty
        this.playerCard1.value = '';
        this.playerCard2.value = '';
        this.dealerCard.value = '';
        
        // Clear all displays
        this.playerCards.innerHTML = '';
        this.dealerCards.innerHTML = '';
        this.clearStrategy();
        
        // Clear split hands
        document.getElementById('splitHand1Cards').innerHTML = '';
        document.getElementById('splitHand2Cards').innerHTML = '';
        document.getElementById('splitHand1Strategy').innerHTML = '';
        document.getElementById('splitHand2Strategy').innerHTML = '';
        
        // Add reset animation
        this.mainContainer.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.mainContainer.style.transform = 'scale(1)';
        }, 150);
        
        this.showMessage('Game reset!', 'success');
    }

    showMessage(message, type) {
        // Create temporary message element
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 3000;
            animation: slideDown 0.3s ease-out;
            background: ${type === 'error' ? '#d13438' : type === 'success' ? '#107c10' : '#0078d4'};
        `;
        
        document.body.appendChild(messageEl);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    showModal() {
        this.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    .strategy-description {
        font-size: 0.9rem;
        margin-top: 5px;
        opacity: 0.8;
    }
    
    .hand-info {
        font-size: 0.8rem;
        margin-top: 8px;
        opacity: 0.7;
    }
    
    .strategy-text {
        text-align: center;
    }
`;
document.head.appendChild(style);

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlackjackStrategyAdvisor();
});
