const NPCS = {
  edda: {
    id:'edda', name:'Edda', title:'Innkeeper of The Wandering Crow',
    portrait:'🧑‍🍳', portraitImg:'img/edda.png', colour:'#f5c842',
    game:'wordle', gameLabel:'Play Her Word Game',
    intro:[
      "The innkeeper looks up from polishing a tankard, her braids catching the firelight.",
      "\"Well, well... a new face. Ain't seen you round The Wandering Crow before.\"\n\nShe slides a frothy ale across the bar without being asked.\n\n\"Sit. Drink. Everyone who comes through that door's got a story worth hearing.\""
    ],
    winDialogue:"She leans in close, eyes glinting.\n\n\"Sharp one, aren't you. Alright — word is, there's a stranger upstairs. Room hasn't been opened since yesterday morning.\"\n\nShe taps her nose.\n\n\"You didn't hear that from me.\"",
    loseDialogue:"She chuckles warmly.\n\n\"Don't worry about it, love. Not everyone's got a head for words.\"\n\nShe refills your cup.\n\n\"Come back when you're ready. I'll still be here.\"",
    alreadyTalked:"Edda gives you a warm nod. \"The others might know more than I do. Go on — they won't bite. Probably.\""
  },
  aldric: {
    id:'aldric', name:'Sir Aldric', title:'Retired Knight of the Realm',
    portrait:'🪖', portraitImg:'img/aldric.jpg', colour:'#9eb8d9',
    game:'chess', gameLabel:'Accept the Challenge',
    intro:[
      "A broad-shouldered man in worn armour sits alone, a chess set arranged before him. He hasn't touched his ale.",
      "\"You play?\" He doesn't look up.\n\n\"Sit down then. I haven't had a decent opponent since the garrison.\"\n\nHe moves a pawn without waiting for your answer."
    ],
    winDialogue:"He sits back, studying you with new eyes.\n\n\"Haven't lost in three years.\"\n\nHe removes his gauntlet and sets it on the table, revealing a ring — a sigil you don't recognise.\n\n\"That seal... you know what it means? Someone in this kingdom does. And they're afraid of it.\"",
    loseDialogue:"\"Hmm.\"\n\nHe resets the pieces methodically.\n\n\"Come back when you've thought about it more. Chess is patience. So is uncovering the truth.\"",
    alreadyTalked:"Aldric glances up from the chess board. \"Still thinking about our game? Good. Use that.\""
  },
  mira: {
    id:'mira', name:'Mira', title:'Travelling Merchant',
    portrait:'🪙', portraitImg:'img/mira.png', colour:'#c8a96e',
    game:'dice', gameLabel:'Roll the Dice with Her',
    intro:[
      "A young woman sits at the corner table, fingers drumming nervously on a leather satchel. Coins are laid out in careful rows before her.",
      "\"Oh! I didn't— I wasn't—\"\n\nShe sweeps the coins aside quickly.\n\n\"Sorry. Habit. I'm a merchant. Was a merchant. It's...\"\n\nShe exhales.\n\n\"You play dice? Just to pass the time, obviously.\""
    ],
    winDialogue:"She stares at your winning roll for a long moment.\n\nThen she reaches into her satchel and slides a folded letter across the table.\n\n\"I found this in a market three towns over. I wasn't supposed to keep it but I was scared.\"\n\nThe letter bears the same sigil as Aldric's ring.",
    loseDialogue:"She shrugs with exaggerated casualness.\n\n\"Lucky me. Though luck doesn't feel like much lately.\"\n\nShe looks back at her coins.\n\n\"Come back. I don't mind the company.\"",
    alreadyTalked:"Mira glances up nervously from her satchel. She gives you a small, unsure smile. \"Still here, are you? Good.\""
  },
  fenwick: {
    id:'fenwick', name:'Old Fenwick', title:'Hermit Sage',
    portrait:'🧙', portraitImg:'img/fenwick.png', colour:'#b89fd4',
    game:'riddle', gameLabel:'Answer His Riddles',
    intro:[
      "An old man in a smoke-stained robe sits alone near the window, watching the rain. He smells faintly of pine and something older.",
      "\"You've been watching me.\"\n\nHe doesn't turn around.\n\n\"Most people do, and then they leave.\"\n\nHe finally looks at you — pale eyes, unsettlingly sharp.\n\n\"Answer my riddles. Then we'll talk.\""
    ],
    winDialogue:"He's quiet for a long time.\n\n\"The name you seek...\"\n\nHe whispers it. A single word. You won't forget it.\n\n\"That name has not been spoken aloud in this kingdom for eleven years. Be careful what you do with it.\"\n\nHe returns to watching the rain.",
    loseDialogue:"He waves a hand, not unkindly.\n\n\"The mind needs silence to hear what the world is saying.\"\n\nHe takes a long sip of something that isn't ale.\n\n\"Come back when you're ready to listen.\"",
    alreadyTalked:"Fenwick turns one pale eye toward you. \"The answers you seek are already in the room. Look at the others.\""
  },
  lyra: {
    id:'lyra', name:'Lyra', title:'Wandering Bard',
    portrait:'🎵', portraitImg:'img/lyra.png', colour:'#f0a8c8',
    game:'memory', gameLabel:'Play the Memory Game',
    intro:[
      "A young woman with a lute on her back is nursing a cider in the corner. She's been humming softly all evening.",
      "\"Oh! Hello.\"\n\nHer smile comes easily but doesn't quite reach her eyes.\n\n\"Would you like to play a game with me?\"\n\nShe pulls out a set of carved wooden tiles.\n\n\"Memory matching. I find it... calming.\""
    ],
    winDialogue:"She watches you finish, then begins to hum — that familiar tune, more clearly now.\n\n\"You know, I wrote this song about a place. A hidden room above a tavern.\"\n\nHer voice drops.\n\n\"The door at the back. It was never really locked. It was waiting.\"",
    loseDialogue:"She laughs softly — not mocking, just gentle.\n\n\"It's hard to focus in a place like this. Too much to take in.\"\n\nShe begins strumming quietly.\n\n\"Come back anytime. The song doesn't change.\"",
    alreadyTalked:"Lyra gives you a quiet, knowing look over her cider. She hums that tune again."
  }
};

const WORDLE_WORDS = [
  {word:'RAVEN',  hint:'"Edda eyes you. \'A bird that watches. A bird that knows.\' She taps the counter twice."'},
  {word:'CASTLE', hint:'"She wipes a glass slowly. \'Something built to last. Something that falls anyway.\'"'},
  {word:'KNIGHT', hint:'"Her voice drops. \'Someone who follows orders. Even the wrong ones.\'"'},
  {word:'GOBLET', hint:'"She holds one up to the light. \'What holds the truth, and the poison, equally well.\'"'},
  {word:'DAGGER', hint:'"She leans close. \'What men reach for when words have failed them.\'"'},
  {word:'FOREST', hint:'"She sighs. \'Where secrets go when they need to disappear.\'"'},
  {word:'MIRROR', hint:'"A pause. \'Shows you what\'s there. Not always what\'s true.\'"'},
  {word:'TAVERN', hint:'"She laughs. \'You\'re already standing in the answer.\'"'},
  {word:'SHADOW', hint:'"She points at the wall. \'What follows everyone here tonight.\'"'},
  {word:'SIGNET', hint:'"Her eyes flick to Aldric\'s table. \'A mark of belonging. Or guilt.\'"'},
];

const RIDDLES = [
  {q:"\"I have hands but cannot clap. I have a face but feel no cold. I tell all men when they are late — yet I am never young or old. What am I?\"",opts:["A mirror","A clock","A candle"],ans:1,flavour:"He nods slowly. \"Time. It is always time.\""},
  {q:"\"The more you take, the more you leave behind. What am I?\"",opts:["Footsteps","Memories","Gold coins"],ans:0,flavour:"\"Every step forward is a path you cannot unwalked.\""},
  {q:"\"I speak without a mouth. I hear without ears. I have no body, but I come alive with the wind. What am I?\"",opts:["A river","A secret","An echo"],ans:2,flavour:"\"And in this tavern tonight... there are many of both.\""},
  {q:"\"What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?\"",opts:["A river","A road","A shadow"],ans:0,flavour:"Fenwick closes his eyes. \"Like truth — it moves whether you wish it to or not.\""},
  {q:"\"I am always hungry, I must always be fed. The finger I touch will soon turn red. What am I?\"",opts:["A sword","Fire","Ambition"],ans:1,flavour:"\"Fire. It warms and devours. Much like the ones who lit the trouble in this town.\""},
  {q:"\"I have cities but no houses live there. I have mountains but no trees grow there. I have water but no fish swim there. What am I?\"",opts:["A dream","A map","A painting"],ans:1,flavour:"\"A map. And someone in this tavern tonight... is following one.\""}
];

const MEMORY_SYMBOLS = ['🗝️','🕯️','🍺','🎲','♟️','🗡️','🦅','🌙'];

const ENDINGS = {
  A:{icon:'⚔️',title:'THE TRUTH',subtitle:'— Ending A —',text:"You push open the door at the back of the tavern.\n\nThe stranger sits in a pool of candlelight — a royal spy, and everything the NPCs feared.\n\nBut you have the sigil. The letter. The name. And the song.\n\nFenwick, Aldric, Mira, Edda, and Lyra step through the door behind you.\n\nFive strangers. One night.\n\nThe kingdom will know the truth by morning."},
  B:{icon:'🌑',title:'THE BARGAIN',subtitle:'— Ending B —',text:"You push open the door.\n\nThe stranger looks at you — unafraid.\n\n\"You don't have enough,\" they say quietly.\n\nThey slide a pouch of gold across the table.\n\n\"Walk away. Tell no one.\"\n\nYou hesitate.\n\nOutside, the rain hasn't stopped.\n\nIt feels like it never will."}
};
