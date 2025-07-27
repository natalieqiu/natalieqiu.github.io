class CombatTracker {
    constructor() {
        this.entities = []; // All combatants (players, enemies, lair actions)
        this.turnOrder = []; // Sorted array of TurnObjects
        this.currentTurnIndex = 0;
    }

    /**
     * Adds an entity to combat.
     * @param {EntityBaseData | LairActionObject} entity
     */
    addEntity(entity) {
        this.entities.push(entity);
    }

    /**
     * Rolls initiative for all entities and sorts turn order.
     */
    rollInitiative() {
        this.turnOrder = [];

        // Generate TurnObjects for each entity
        for (const entity of this.entities) {
            if (entity.turns > 1) {
                // Bosses get multiple turns
                for (let i = 0; i < entity.turns; i++) {
                    this.turnOrder.push(new TurnObject(entity));
                }
            } else {
                // Normal entities and lair actions get 1 turn
                this.turnOrder.push(new TurnObject(entity));
            }
        }

        // Roll initiative for each turn and sort
        this.turnOrder.forEach(turn => turn.rollInit());
        this.turnOrder.sort((a, b) => b.initiative - a.initiative); // Descending order
        this.currentTurnIndex = 0;
    }

    /**
     * Advances to the next turn.
     * @returns {TurnObject | null} The next turn, or null if combat is over.
     */
    nextTurn() {
        if (this.turnOrder.length === 0) return null;

        const currentTurn = this.turnOrder[this.currentTurnIndex];
        this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
        return currentTurn;
    }

    /**
     * Resets combat (clears all entities and turn order).
     */
    reset() {
        this.entities = [];
        this.turnOrder = [];
        this.currentTurnIndex = 0;
    }
}