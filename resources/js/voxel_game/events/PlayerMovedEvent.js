import {ServerEvent} from "./Event.js";
import {Game} from "../game.js";
import Entity from "../entities/entity.js";
import PlayerAddedEvent from "./PlayerAddedEvent.js";

export default class PlayerMovedEvent extends ServerEvent{

    /**
     *
     * @param {Game} game
     * @param data
     */
    run(game, data) {
        if(!(data['e-uuid'] in game.entities))
            new PlayerAddedEvent().run(game, data);

        game.entities[data['e-uuid']].updatePosition(data['position'])
    }
}
