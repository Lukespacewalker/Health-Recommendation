# CVD consolidation and alcohol guidance review

Reviewed against `main` at commit `d9d9443d7d702e43df84fea02ab8e93d1c2c8622`.

## Slide consolidation

Two pairs of overlapping cardiovascular slides are combined:

1. `cvd-risk-score` + `risk-tools`
   - Keeps the explanation of what a risk score does and does not mean.
   - Keeps the Thai CV Risk versus PREVENT comparison.
   - Keeps PREVENT categories on the same slide.
   - Removes the separate `risk-tools` slide before Reveal.js builds navigation.

2. `cac` + `cac-interpretation`
   - Keeps the selective Three.js CAC scene.
   - Keeps what CAC measures, its limitations, radiation note, score bands, and when it is useful.
   - Removes the separate `cac-interpretation` slide before Reveal.js builds navigation.

The CVD chapter therefore loses two slides without losing distinct user-facing information.

## Alcohol guidance added to the liver chapter

Two slides are added:

- `alcohol-guide`
  - CDC ceiling for adults who choose to drink: no more than 2 U.S. standard drinks in a day for men and no more than 1 for women.
  - The ceiling is not a recommendation, quota, or safe level.
  - WHO and CDC cancer guidance are shown alongside the 2/1 ceiling so the message is not misread as risk-free drinking.
  - Examples show how container size and ABV change the number of drinks.
  - U.S. 14 g and Thai/AUDIT 10 g definitions are separated explicitly.

- `alcohol-calculator`
  - Inputs: volume in mL, ABV, number of servings, and the sex-based CDC ceiling used for comparison.
  - Formula: grams ethanol = volume × ABV/100 × 0.789 × servings.
  - Outputs: grams ethanol, U.S. standard drinks (14 g), and Thai/AUDIT drinks (10 g).
  - Presets: regular beer, stronger beer, wine, spirits, and soju.
  - The output does not estimate BAC, fitness to drive, or individual safety.

## Calculator test cases

| Example | Ethanol | U.S. drinks | Thai/AUDIT drinks |
|---|---:|---:|---:|
| Beer 330 mL at 5% | 13.0 g | 0.93 | 1.30 |
| Craft beer 330 mL at 8% | 20.8 g | 1.49 | 2.08 |
| Wine 150 mL at 12% | 14.2 g | 1.01 | 1.42 |
| Wine bottle 750 mL at 12% | 71.0 g | 5.07 | 7.10 |
| Spirits 45 mL at 40% | 14.2 g | 1.01 | 1.42 |
| Soju 360 mL at 16.5% | 46.9 g | 3.35 | 4.69 |

## Primary references

- [CDC: About Moderate Alcohol Use](https://www.cdc.gov/alcohol/about-alcohol-use/moderate-alcohol-use.html)
- [CDC: Alcohol and Cancer](https://www.cdc.gov/cancer/risk-factors/alcohol.html)
- [NIAAA: What Is a Standard Drink?](https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink)
- [NIAAA: Alcohol Drink Size Calculator](https://rethinkingdrinking.niaaa.nih.gov/tools/calculators/alcohol-drink-size-calculator)
- [WHO: No level of alcohol consumption is safe for our health](https://www.who.int/azerbaijan/news/item/04-01-2023-no-level-of-alcohol-consumption-is-safe-for-our-health)
- [ThaiHealth: AUDIT standard drink examples](https://happyworkplace.thaihealth.or.th/eval_tool/999c003b-2682-4f50-bef0-688976d6fcdd)
- [AHA PREVENT](https://professional.heart.org/en/guidelines-and-statements/about-prevent-calculator)
- [AHA: CAC Test](https://www.heart.org/en/health-topics/heart-attack/diagnosing-a-heart-attack/cac-test)
