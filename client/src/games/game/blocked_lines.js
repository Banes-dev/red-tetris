/**
 * Adds blocked lines to the bottom of the board
 * @param {Array} board - The current game board
 * @param {number} lines - Number of lines to add
 * @returns {Array} The board with blocked lines added
 */
export function addBlockedLines(board, lines) {
    // Create a copy of the board to avoid mutating the original
    const newBoard = board.map(row => [...row])

    // Create all blocked lines first - completely filled
    const blockedLines = []
    for (let i = 0; i < lines; i++) {
        // Complete blocked line
        const blockedLine = Array(10).fill(2)
        blockedLines.push(blockedLine)
    }

    // Remove lines from the top to make space for blocked lines
    for (let i = 0; i < lines; i++) {
        newBoard.shift()  // Remove from top
    }

    // Add blocked lines at the bottom, pushing existing content up
    return [...newBoard, ...blockedLines]
}
