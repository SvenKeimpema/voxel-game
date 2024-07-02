import {ServerEvent} from "./Event.js";
import {Game} from "../game.js";
import Entity from "../entities/entity.js";

export default class PlayerAddedEvent extends ServerEvent{

    /**
     *
     * @param {Game} game
     * @param data
     */
    run(game, data) {
        game.entities[data['e-uuid']] = new Entity(game.scene, data['position'])
    }

}
