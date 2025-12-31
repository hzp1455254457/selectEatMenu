# Visual Enhancements Spec

## 1. Confetti
-   **Library**: `canvas-confetti`
-   **Trigger**: When the randomizer stops and displays a result.
-   **Config**: Spread 70, origin y 0.6.

## 2. Animations
-   **Lists**: Use `<TransitionGroup name="list">` for `MenuList` and `HistoryList`.
-   **CSS**:
    -   `list-enter-active`, `list-leave-active`: transition all 0.5s ease.
    -   `list-enter-from`, `list-leave-to`: opacity 0, transform translateX(30px).

## 3. Styling
-   **Buttons**: Gradient backgrounds (e.g., `#4facfe` to `#00f2fe`).
-   **Cards**: Box shadow with hover lift (`transform: translateY(-2px)`).
