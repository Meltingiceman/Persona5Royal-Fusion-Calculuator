const RoyalArcana = {
    Fool: 0, Magician: 1, Priestess: 2, Empress: 3, Emperor: 4, Hierophant: 5, Lovers: 6, Chariot: 7,
    Justice: 8, Hermit: 9, Fortune: 10, Strength: 11, Hanged: 12, Hanged_Man: 12, Death: 13, Temperance: 14, Devil: 15,
    Tower: 16, Star: 17, Moon: 18, Sun: 19, Judgement: 20, Faith: 21, Councillor: 22, Consultant: 22, World: 23
}

const StrikersArcana={
    Fool: 0, Magician: 1, Priestess: 2, Empress: 3, Emperor: 4, Hierophant: 5, Lovers: 6, Chariot: 7,
    Justice: 8, Hermit: 9, Fortune: 10, Strength: 11, Hanged: 12, Hanged_Man: 12, Death: 13, Temperance: 14, Devil: 15,
    Tower: 16, Star: 17, Moon: 18, Sun: 19, Judgement: 20, Hope: 21, Apostle: 23
}

exports.Arcana = RoyalArcana;

const Resistance = {
    Weak: -1, Normal: 0, Resist: 1, Null: 2, Repel: 3, Absorb: 4,
}

exports.Resistance = Resistance;

/*The number represents which arcana the result will be if you fuse the indeces together
    i.e. if you fuse two fool arcanas [0, 0] you will get another fool and if you fuse 
    a fool with a magician [0, 1] then you'll get death (13)*/
const arcanaChart = [
    [0, 13, 18, 12, 14, 9, 7, 18, 17, 2, 21, 13, 16, 11, 5, 14, 3, 1, 8, 8, 19, 22, 5, ], 
    [13, 1, 14, 8, 21, 13, 15, 2, 4, 6, 8, 0, 3, 9, 7, 5, 14, 2, 6, 5, 11, 11, 18, ], 
    [18, 14, 2, 4, 3, 1, 10, 5, 13, 14, 1, 15, 13, 1, 15, 18, 12, 9, 5, 7, 8, 8, 21, ], 
    [12, 8, 4, 3, 8, 0, 20, 17, 6, 11, 9, 21, 2, 0, 21, 19, 4, 6, 10, 16, 4, 1, 12, ], 
    [14, 21, 3, 8, 4, 10, 0, 21, 7, 5, 19, 16, 15, 9, 15, 8, 17, 6, 16, 20, 2, 2, 6, ], 
    [9, 13, 1, 0, 10, 5, 11, 17, 12, 22, 8, 0, 19, 7, 13, 12, 20, 16, 2, 6, 21, 3, 8, ], 
    [7, 15, 10, 20, 0, 11, 6, 14, 20, 7, 11, 13, 22, 14, 11, 18, 3, 21, 1, 3, 12, 16, 16, ], 
    [18, 2, 5, 17, 21, 17, 14, 7, 18, 15, 22, 9, 0, 15, 11, 14, 10, 18, 6, 2, -1, 6, 19, ], 
    [17, 4, 13, 6, 7, 12, 20, 18, 8, 1, 4, 22, 6, 0, 4, 0, 19, 3, 15, 12, -1, 12, 4, ], 
    [2, 6, 14, 11, 5, 22, 7, 15, 1, 9, 17, 5, 17, 11, 11, 2, 20, 11, 7, 15, 4, 20, 21, ], 
    [21, 8, 1, 9, 19, 8, 11, 22, 4, 17, 10, 21, 4, 17, 3, 5, 12, 15, 19, 17, 16, 22, 20, ], 
    [13, 0, 15, 21, 16, 0, 13, 9, 22, 5, 21, 11, 14, 5, 7, 13, 21, 18, 1, 18, -1, 17, 3, ], 
    [16, 3, 13, 2, 15, 19, 22, 0, 6, 17, 4, 14, 12, 18, 13, 10, 9, 8, 22, 5, 17, 15, 17, ], 
    [11, 9, 1, 0, 9, 7, 14, 15, 0, 11, 17, 5, 18, 13, 12, 7, 19, 22, 5, 10, -1, 0, 1, ], 
    [5, 7, 15, 21, 15, 13, 11, 11, 4, 11, 3, 7, 13, 12, 14, 0, 10, 19, 22, 1, 9, 9, 0, ], 
    [14, 5, 18, 19, 8, 12, 18, 14, 0, 2, 5, 13, 10, 7, 0, 15, 1, 11, 7, 9, 6, 7, 7, ], 
    [3, 14, 12, 4, 17, 20, 3, 10, 19, 20, 12, 21, 9, 19, 10, 1, 16, 22, 9, 4, 18, 13, 13, ], 
    [1, 2, 9, 6, 6, 16, 21, 18, 3, 11, 15, 18, 8, 22, 19, 11, 22, 17, 14, 20, 10, 14, 19, ], 
    [8, 6, 5, 10, 16, 2, 1, 6, 15, 7, 19, 1, 22, 5, 22, 7, 9, 14, 18, 3, 0, 19, 14, ], 
    [8, 5, 7, 16, 20, 6, 3, 2, 12, 15, 17, 18, 5, 10, 1, 9, 4, 20, 3, 19, 13, 4, 10, ], 
    [19, 11, 8, 4, 2, 21, 12, -1, -1, 4, 16, -1, 17, -1, 9, 6, 18, 10, 0, 13, 20, 10, 15, ], 
    [22, 11, 8, 1, 2, 3, 16, 6, 12, 20, 22, 17, 15, 0, 9, 7, 13, 14, 19, 4, 10, 21, 2, ], 
    [5, 18, 21, 12, 6, 8, 16, 19, 4, 21, 20, 3, 17, 1, 0, 7, 13, 19, 14, 10, 15, 2, 22, ],
];

/*Anything using this will have to use a seperate function. This is to make sure that 
  correct values are being used when using this table*/
const inheritsTable = [
    [true, false, false, false, false, false, false, false, false, true, true, true, true, true], //physical (this includes guns)
    [true, true, false, true, true, true, true, true, true, true, true, true, true, true], 
    [true, false, true, true, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, false, true, true, true, true, true, true, true, true, true],
    [true, true, true, false, true, true, true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, false, true, true, true, true, true, true, true],
    [true, true, true, true, true, false, true, true, true, true, true, true, true, true],
    [false, true, true, true, true, true, true, true, false, true, false, true, true, true], //Bless
    [false, true, true, true, true, true, true, false, true, false, true, true, true, true], //Curse
    [true, true, true, true, true, true, true, false, true, false, true, true, true, true], //Ailment
    [false, true, true, true, true, true, true, true, false, true, true, true, true, true], //Aid/Recovery
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true] //Almighty
]

function findCombos(targetArcana)
{
    let indeces = []; //will be a 2-d array
    for(let i = 0; i < arcanaChart.length; i++)
    {
        for(let j = i; j < arcanaChart[i].length; j++)
        {
            if(arcanaChart[i][j] === targetArcana)
                indeces.push([i, j])
        }
    }

    return indeces
}

//Every persona's move will have a type represented by a number
const Type ={
    physical: 0, gun: 1, fire: 2, ice: 3, elec: 4, wind: 5, psychic: 6, nuclear: 7, bless: 8, curse: 9,
    ailment: 10, aid: 11, almighty: 12, support: 13, passive: 14
}

exports.getInheritNum = function typeToInheritType(num)
{
    if(num === 0)
        return num
    
    return num-1
}

exports.Skill = class Skill
{
    constructor(name, type, effect, cost)
    {
        this.name = name
        this.type = type
        this.effect = effect
        this.cost = cost
    }
}

class Trait
{
    constructor(name, effect)
    {
        this.name = name
        this.effect = effect
    }
}

exports.Trait = Trait

class Persona
{
    constructor(arcana, name, lvl, stats, res, skills, item, itemr, trait, inherits = undefined){
        this.arcana = arcana
        this.name = name;
        this.level = lvl;
        this.stats = stats;
        this.res = res
        this.skillList = skills
        this.item = item
        this.itemr = itemr
        this.trait = trait
        this.advanced = this.treasure = false
        this.inherits = inherits
    }

    getArcana(){
        return this.arcana
    }

    getLevel(){
        return this.level 
	}
	
	getName(){
		return this.name
	}

	getStats(){
		return this.stats
	}

	getResists(){
		return this.res
    }
    
    toString(){
        return this.name + " " + this.level
    }
}

exports.Persona = Persona

exports.AdvancedPersona = class AdvancedPersona extends Persona
{
	constructor(arcana, name, lvl, stats, res, skills, item, itemr, trait, recipe, inherits = undefined){
		super(arcana, name, lvl, stats, res, skills, item, itemr, trait, inherits)
		this.recipe = recipe
        this.advanced = true
    }

	getRecipe(){
		return this.recipe
	}
}

exports.TreasureDemon = class TreasureDemon extends Persona
{
	constructor(arcana, name, lvl, stats, res, skills, item, itemr, trait, tierChart, inherits = undefined){
		super(arcana, name, lvl, stats, res, skills, item, itemr, trait, inherits)
		this.tierChart = tierChart
        this.treasure = true
    }

	getChart(){
		return this.tierChart
	}
}

exports.Type = Type
exports.InheritsChart = inheritsTable
exports.arcanaChart = arcanaChart;
exports.findCombos = findCombos;
