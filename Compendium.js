let skills = require('./Data/SkillData.js')
let personas = require('./Data/PersonaData.js')
let genData = require('./Data/GeneralData.js')

const chart = genData.arcanaChart; //2-D array
const byArcana = personas.byArcana; //2-D array

const findCombos = genData.findCombos;
const getInheritVal = genData.getInheritNum;
const Arcana = genData.Arcana;
const TreasureDemon = genData.TreasureDemon;
const AdvancedPersona = genData.AdvancedPersona;

let listArr = sort()
const byLevel = listArr[0]
const alphabetized = listArr[1]
const treasureDemons = listArr[2]
const byinherits = listArr[3]

function sort()
{
    let byLevel = []
    let alphabetized = []
    let treasure = []
    let byinherits = []
    let temp, ix = 0

    for(let i = 0; i < byArcana.length; i++){
        for(let j = 0; j < byArcana[i].length; j++, ix++){
            byLevel[ix] = byArcana[i][j]
            alphabetized[ix] = byArcana[i][j]

            if(byLevel[ix] instanceof TreasureDemon){
                treasure.push(byLevel[ix])
            }
        }
    }

    //Sorting the alphabetized
    for(let i = 0; i < byLevel.length; i++){
        for(let j = 0; j < byLevel.length; j++){
            if(byLevel[i].level < byLevel[j].level){
                temp = byLevel[i]
                byLevel[i] = byLevel[j]
                byLevel[j] = temp
            }

            if(alphabetized[i].name.localeCompare(alphabetized[j].getName()) < 0){
                temp = alphabetized[i]
                alphabetized[i] = alphabetized[j]
                alphabetized[j] = temp
            }
        }
    }

    //Sorting the inherits
    for(let i = 0; i < 12; i++)
    {
        byinherits.push([])
    }

    for(let i = 0; i < byLevel.length; i++)
    {
        byinherits[getInheritVal(byLevel[i].inherits)].push(byLevel[i])
    }

    return [byLevel, alphabetized, treasure, byinherits]
}

function fuse(pers1, pers2, resArcana = null)
{
    if(pers1 === pers2)
        return null;
    if(pers1.arcana === Arcana.World || pers2.arcana === Arcana.World)
        return null;
    
    if((pers1 instanceof TreasureDemon && !(pers2 instanceof TreasureDemon)) || 
      (!(pers1 instanceof TreasureDemon) && pers2 instanceof TreasureDemon)){
        return treasureFusion(pers1, pers2)
    }
    
    if(resArcana === null)
        resArcana = chart[pers1.arcana][pers2.arcana]
    
    if(resArcana === -1)
        return null
    
    

    let resLevel = Math.floor((pers1.level + pers2.level) / 2 + 1)
    let arcanaList = byArcana[resArcana]
    let resPersona = null, found = false

    if(pers1.arcana !== pers2.arcana){
        for(let i = 0; i < arcanaList.length && !found; i++){
            resPersona = arcanaList[i]
            if(resPersona.level >= resLevel){
                if(resPersona instanceof TreasureDemon || resPersona instanceof AdvancedPersona 
                    || pers1 === resPersona || pers2 === resPersona){
                    continue;
                }
                found = true
            }
        }
    }
    else{
        if(arcanaList === undefined)
            console.log("fhgu ijf iojp")
        for(let i = arcanaList.length - 1; i >= 0 && !found; i--){
            resPersona = arcanaList[i]
            if(resPersona.level <= resLevel){
                if(resPersona instanceof TreasureDemon || resPersona instanceof AdvancedPersona 
                    || pers1.name === resPersona.name || pers2.name === resPersona.name){
                    continue;
                }
                found = true
            }
        }
    }
    return found ? resPersona : null
}

function treasureFusion(pers1, pers2)
{
    let chart, treasure, normal
    if(pers1 instanceof TreasureDemon){
        treasure = pers1
        normal = pers2
    }
    else{
        treasure = pers2
        normal = pers1
    }

    chart = treasure.getChart()
    let steps = chart[normal.arcana]
    let arr = byArcana[normal.arcana], found = false
    let i = 0

    for(i = 0; i < arr.length && !found; i++){
        found = arr[i].name === normal.name
    }
    i--;

    return arr[i + steps]

}

function findFusions(targetPersona)
{
    // console.log("in function")
    if(targetPersona instanceof TreasureDemon)
        return null
    
    if(targetPersona instanceof AdvancedPersona)
        return targetPersona.recipe

    let indexList = findCombos(targetPersona.arcana)
    let personaList = []
    let persona
    // console.log("Starting loop")
    for(let count = 0; count < indexList.length; count++)
    {
        //indexList will only contain arrays with 2 elements in them so this is okay 
        let ix1 = indexList[count][0]
        let ix2 = indexList[count][1]
        let newAddition, start

        for(let i = 0; i < byArcana[ix1].length; i++)
        {
            if(byArcana[ix1] === byArcana[ix2])
                start = i
            else
                start = 0
            for(let j = start; j < byArcana[ix2].length; j++)
            {   
                persona = fuse(byArcana[ix1][i], byArcana[ix2][j])
                if(persona !== null && persona !== undefined && persona.name === targetPersona.name){
                    newAddition = {first: byArcana[ix1][i], second: byArcana[ix2][j]}
                    personaList.push(newAddition)
                }
            }
        }
    }

    let arcanaArr = byArcana[targetPersona.arcana], temp

    for(let i = 0; i < arcanaArr.length; i++){
        if(arcanaArr[i].name === targetPersona.name)
            continue
        for(let j = 0; j < treasureDemons.length; j++){
            temp = fuse(arcanaArr[i], treasureDemons[j])
            if(temp !== null && temp !== undefined && temp.name === targetPersona.name)
                personaList.push({first: arcanaArr[i], second: treasureDemons[j]})
        }
    }

    return personaList
}

function fuseWithAll(persona)
{
    let list = [], varResult, fuseWith
    for(let i = 0; i < byLevel.length; i++)
    {
        fuseWith = byLevel[i]
        if(fuseWith === persona)
            continue
        varResult = fuse(persona, fuseWith)
        
        if(varResult === undefined)
            continue

        if(varResult !== null)
            list.push({fuser: fuseWith, result: varResult})
    }
    return list
}

function getRes(num){
    switch(num)
    {
      case -1:
          return 'Weak'
      case 0:
          return'-'
      case 1:
          return 'Resist'
      case 2:
          return 'Null'
      case 3:
          return 'Repel'
      case 4:
          return 'Absorb'
      default:
          return "-"
    }
}

function getType(num){
    switch(num)
    {
        case 0:
            return "Physical"
        case 1:
            return "Gun"
        case 2:
            return "Fire"
        case 3:
            return "Ice"
        case 4:
            return "Lightning"
        case 5:
            return "Wind"
        case 6:
            return "Psychic"
        case 7:
            return "Nuclear"
        case 8:
            return "Bless"
        case 9:
            return "Curse"
        case 10:
            return "Ailment"
        case 11:
            return "Aid"
        case 12:
            return "Almighty"
        case 13:
            return "Support"
        case 14:
            return "Passive"
    }
}

function getArcana(num)
{
    switch(num){
        case 0: return "Fool"
        case 1: return "Magician"
        case 2: return "Priestess"
        case 3: return "Empress"
        case 4: return "Emperor"
        case 5: return "Hierophant"
        case 6: return "Lovers"
        case 7: return "Chariot"
        case 8: return "Justice"
        case 9: return "Hermit"
        case 10: return "Fortune"
        case 11: return "Strength"
        case 12: return "Hanged Man"
        case 13: return "Death"
        case 14: return "Temperance"
        case 15: return "Devil"
        case 16: return "Tower"
        case 17: return "Star"
        case 18: return "Moon"
        case 19: return "Sun"
        case 20: return "Judgement"
        case 21: return "Faith"
        case 22: return "Councillor"
        case 23: return "World"
        default: return num
      }
}

let temp = []
for(let i = 0; i < byArcana.length; i++){
    for(let j = 0; j < byArcana[i].length; j++){
        temp.push(byArcana[i][j])
    }
}

exports.findPersona = function(name)
{
    console.log(typeof name)
    console.log("Fresh start: " + name)

    for(let i = 0; i < alphabetized.length; i++)
    {
        if(alphabetized[i].name.toLowerCase() === name.toLowerCase())
            return alphabetized[i]
    }
    // alphabetized.forEach(item => {
    //     console.log(typeof item.name)
    //     if(item.name.toLowerCase() === name.toLowerCase())
    //         return item
    // })
    return null
}


exports.findFusions = findFusions;
exports.fuse = fuse
exports.fuseAll = fuseWithAll;
exports.byLevel = byLevel
exports.byArcana = temp
exports.alphabetized = alphabetized
exports.byInherits = byinherits
exports.getRes = getRes
exports.getArcana = getArcana
exports.getType = getType

//testing the functions above
//--------------------------------
// let temp = findFusions(new Persona(Arcana.Fool, "Arsene", 1, [2, 2, 2, 3, 1],
//                         [Resistance.Normal, Resistance.Normal, Resistance.Normal, Resistance.Weak, Resistance.Normal, Resistance.Normal, Resistance.Normal, Resistance.Normal, Resistance.Weak, Resistance.Resist, ]))

// let result = fuse(new TreasureDemon(Arcana.Emperor, "Regent", 10,
//                 [10, 10, 10, 10, 10],
//                 [Resistance.Resist, Resistance.Resist, Resistance.Normal, Resistance.Normal, Resistance.Normal, Resistance.Normal, Resistance.Normal, Resistance.Weak, Resistance.Normal, Resistance.Normal, ], 
//                 [-1, 1, -1, -1, 2, 1, -1, 1, 1, 2, 1, -1, 1, 1, -1, -2, -1, 1, -1, 1, -1, -1, 1, ]), 
// new Persona(Arcana.Fool, "Obariyon", 8,
//                 [7, 3, 9, 8, 4],
//                 [Resistance.Resist, Resistance.Normal, Resistance.Normal, Resistance.Normal, Resistance.Weak, Resistance.Normal, Resistance.Normal, Resistance.Normal, Resistance.Normal, Resistance.Normal, ], ), 
// )

// console.log(temp)