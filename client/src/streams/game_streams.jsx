import flyd from "flyd"

export const input$ = flyd.stream()
export const state$ = flyd.stream()

export function sendInput(input) {
	input$(input)
}
