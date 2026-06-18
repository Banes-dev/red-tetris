import RoomManager from "./RoomManager.js"

describe("RoomManager", () => {
	const roomManager = new RoomManager()

	beforeEach(() => {
		// Clear rooms before each test
		roomManager.rooms.clear()
	})

	describe("createRoom", () => {
		it("should create a room with consistent seed based on room name", () => {
			const config = {
				roomName: "test-room",
				gravityLevel: 1,
				invisiblePieces: false,
				timeLimit: 300,
				playerLimit: 2,
				isPrivate: false,
				roomPassword: null
			}

			const room1 = roomManager.createRoom(config)
			expect(room1).not.toBeNull()
			expect(room1.id).toBe("test-room")
			expect(room1.seed).toBeDefined()

			// Create another room with same name (should return null since room exists)
			const room2 = roomManager.createRoom(config)
			expect(room2).toBeNull()

			// Delete the room and create it again - should have same seed
			roomManager.deleteRoom("test-room")
			const room3 = roomManager.createRoom(config)
			expect(room3.seed).toBe(room1.seed)
		})

		it("should generate different seeds for different room names", () => {
			const config1 = {
				roomName: "room-1",
				gravityLevel: 1,
				invisiblePieces: false,
				timeLimit: 300,
				playerLimit: 2,
				isPrivate: false,
				roomPassword: null
			}

			const config2 = {
				roomName: "room-2",
				gravityLevel: 1,
				invisiblePieces: false,
				timeLimit: 300,
				playerLimit: 2,
				isPrivate: false,
				roomPassword: null
			}

			const room1 = roomManager.createRoom(config1)
			const room2 = roomManager.createRoom(config2)

			expect(room1.seed).not.toBe(room2.seed)
		})

		it("should generate same seed for same room name", () => {
			const config1 = {
				roomName: "consistent-room",
				gravityLevel: 1,
				invisiblePieces: false,
				timeLimit: 300,
				playerLimit: 2,
				isPrivate: false,
				roomPassword: null
			}

			const config2 = {
				roomName: "consistent-room",
				gravityLevel: 2, // different gravity
				invisiblePieces: true, // different settings
				timeLimit: 600,
				playerLimit: 4,
				isPrivate: true,
				roomPassword: "password"
			}

			// First room creation should fail since we're using same name
			const room1 = roomManager.createRoom(config1)
			expect(room1).not.toBeNull()

			// Second room with same name should fail
			const room2 = roomManager.createRoom(config2)
			expect(room2).toBeNull()

			// But if we delete and recreate, it should have same seed
			roomManager.deleteRoom("consistent-room")
			const room3 = roomManager.createRoom(config2)
			expect(room3.seed).toBe(room1.seed)
		})
	})

	describe("hashStringToNumber", () => {
		it("should generate consistent hash for same input", () => {
			const hash1 = roomManager.hashStringToNumber("test-string")
			const hash2 = roomManager.hashStringToNumber("test-string")
			expect(hash1).toBe(hash2)
		})

		it("should generate different hash for different input", () => {
			const hash1 = roomManager.hashStringToNumber("string-1")
			const hash2 = roomManager.hashStringToNumber("string-2")
			expect(hash1).not.toBe(hash2)
		})

		it("should always return positive number", () => {
			const hash1 = roomManager.hashStringToNumber("any-string")
			const hash2 = roomManager.hashStringToNumber("")
			expect(hash1).toBeGreaterThanOrEqual(0)
			expect(hash2).toBeGreaterThanOrEqual(0)
		})
	})
})