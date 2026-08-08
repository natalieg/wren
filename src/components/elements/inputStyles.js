// Shared box metrics for .input and its read-only twin .input-view, so that
// Input and LabeledField's viewOnly mode land on identical padding — if these
// drift apart, switching a field between the two modes shifts the layout.
// Lives in its own file because exporting a non-component from a component
// module breaks React Fast Refresh (react-refresh/only-export-components).

// An explicit padding still wins, so `slim` is a starting point and not a cage.
export const inputPadding = (slim, padding) => padding ?? (slim ? 'px-2 py-0.5' : 'px-2 py-2')
