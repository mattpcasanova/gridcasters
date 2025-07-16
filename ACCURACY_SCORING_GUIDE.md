# RankBet Accuracy Scoring System

## 🎯 What We're Measuring

Think of it like this: You're trying to predict which players will be the best performers in fantasy football each week. It's like predicting who will win a race, but instead of just picking the winner, you have to rank ALL the runners from 1st to 36th place.

## 📊 How Scoring Works (Simple Version)

**The closer your guess is to reality, the more points you get.**

| How Far Off You Are | Points You Get | What This Means |
|-------------------|----------------|-----------------|
| **Perfect!** (exactly right) | 100 points | 🎯 You nailed it! |
| **1 spot off** | 85 points | 😊 Really close! |
| **2 spots off** | 70 points | 🙂 Pretty good! |
| **3 spots off** | 55 points | 😐 Not bad |
| **4 spots off** | 40 points | 😕 Getting worse |
| **5 spots off** | 25 points | 😞 Pretty far off |
| **6-10 spots off** | 25→10 points | 😞 Way off |
| **11+ spots off** | 10→0 points | 😱 Really wrong |

## 🏆 Bonus Points (Extra Credit!)

You get **bonus points** for being really smart:

| What You Did Right | Bonus Points | Why It's Special |
|-------------------|--------------|------------------|
| **Predicted a top 10 player correctly** | +15 points | You spotted a star! |
| **Predicted a top 5 player correctly** | +10 extra points | You're really good at this! |

## 💥 Penalties (Oops!)

You lose points for big mistakes:

| What You Got Wrong | Penalty Points | Why It Hurts |
|-------------------|----------------|--------------|
| **Ranked a bust in your top 10** | -15 points | You thought they'd be great, but they stunk |
| **Ranked a bust in your top 5** | -20 points | You really thought they'd be amazing, but they were terrible |
| **Ranked someone who didn't play** | -10 points | You picked someone who was injured/suspended |

## 🚫 What's a "Bust"?

A **bust** is when you think someone will be great, but they end up being terrible.

**Example:** You rank a player #3, thinking they'll be one of the best. But they finish #25. That's a bust!

## 🧮 Your Final Score

Your final accuracy score is the average of all your predictions, plus your bonuses, minus your penalties.

**Example:**
- You made 36 predictions
- Average prediction score: 75 points
- Bonuses: +45 points
- Penalties: -20 points
- **Final Score: 78.5%**

## 🏈 Real-World Example

Let's say you're ranking Quarterbacks (QBs) for Week 1:

| Your Rank | Player | Actual Rank | Base Score | Bonuses | Penalties | Total |
|-----------|--------|-------------|------------|---------|-----------|-------|
| 1 | Josh Allen | 1 | 100 | +25 | 0 | 125 |
| 2 | Patrick Mahomes | 3 | 85 | +25 | 0 | 110 |
| 3 | Jalen Hurts | 8 | 25 | +15 | 0 | 40 |
| 4 | Lamar Jackson | 2 | 70 | +25 | 0 | 95 |
| 5 | Justin Herbert | 25 | 5 | 0 | -35 | -30 |

**Average Base Score: 57**  
**Total Bonuses: 90, Total Penalties: 35**  
**Net Bonus: 55 ÷ 5 players = +11 per player**  
**Final QB Score: 57 + 11 = 68%**

## 🏆 Position Differences

Different positions are harder or easier to predict:

| Position | Difficulty | Why? |
|----------|------------|------|
| **QB** | Easier | Quarterbacks are more consistent |
| **RB** | Medium | Running backs are somewhat predictable |
| **WR** | Harder | Wide receivers are more volatile |
| **TE** | Hardest | Tight ends are the most unpredictable |

## 📊 What's a Good Score?

Based on our simulations with 1,000 users:

| Score Range | How Good You Are | % of Users |
|-------------|------------------|------------|
| 90-100% | **Elite** | 15.6% |
| 80-89% | **Excellent** | 32.1% |
| 70-79% | **Good** | 33.2% |
| 60-69% | **Average** | 16.1% |
| Below 60% | **Needs Work** | 3.2% |

**Most people score between 70-89%**

## 🎯 The Bottom Line

**It's like a test where:**
- Getting the exact answer right = 100 points
- Being close = still good points
- Being way off = few points
- Making big mistakes = lose points
- Being really smart = bonus points

**The goal:** Get as close as possible to predicting how players will actually perform!

---

*This system rewards both accuracy and smart decision-making, just like real fantasy football!* 