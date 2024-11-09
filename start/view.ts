import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as heroIcons } from '@iconify-json/heroicons'
import { icons as game_icons } from '@iconify-json/game-icons'
import edge from 'edge.js'

addCollection(heroIcons)
addCollection(game_icons)

edge.use(edgeIconify)
