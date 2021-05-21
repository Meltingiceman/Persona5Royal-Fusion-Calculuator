import React, {useState} from 'react';
import {Table, TableBody, TableRow, TableHead, TableCell, TableContainer} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Button} from '@material-ui/core'
import {Link} from "react-router-dom"

const data = require('./Compendium.js')
const sidePadding = 25
const tableMax = 15;
const useStyles=makeStyles({
    table: {
        maxWidth: 850,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallTable:{
        display:'flex',
        maxWidth: 650,
        justifyContent: 'center', 
        alignItems: 'center',
    }
})

function getRowStyle(count = 0)
{
    let color = (count%2 ? "white":"GainsBoro")

    return {backgroundColor: color}
}

const headerStyle={display: 'flex', justifyContent:'center', alignItems: 'center'}
const centered={display: 'flex', justifyContent:'center', alignItems: 'center'}
const header={display: 'flex', justifyContent:'center', alignItems: 'center', outline: "thin solid black"}
const backGround={} //might come back to this later
var classes

function Detailed(props)
{
    
    classes = useStyles()
    return(
        <SingleView name ={props.persona}/>
    )
}

function findPersona(persona, list = data.alphabetized, start = 0, end = list.length){
    try{
        let ix = Math.floor((start + end)/2)

        let comp = persona.localeCompare(list[ix].name)
        if(comp === 0)
            return list[ix]
        if(comp < 0)
            return findPersona(persona, list, start, ix - 1)
        
        return findPersona(persona, list, ix + 1, end)
    }
    catch(err)
    {
        return null
    }
}

function SingleView(props)
{
    let persona = findPersona(props.name, )

    if(persona === null)
        return(<p>I could not find that persona. Make sure the persona's name is spelled correctly</p>)

    return(
        <div style={{backgroundColor: 'black', paddingLeft: sidePadding, paddingRight: sidePadding, paddingTop: 15, paddingBottom: 15}}>
            <div style={{backgroundColor: 'LightGrey'}}>
                
                <MakeHeader persona = {persona} /><br />
                <hr style={{color: "thin solid black", borderStyle:"solid"}}/> 
                
                {/*Itemization info (Info on the items you get for using the electric chair) */}
                <h2 style={centered}>Itemization</h2>
                <div style={{textAlign: "center"}}>

                    <b style={{color: "Green"}}>Normal:</b> <t>{persona.item}</t><br /> {/* Normal item*/}
                    <b style={{color: "red"}}>Fusion Alarm:</b> {persona.itemr} {/* Fusion alarm item*/}
                
                </div>
                <br />
                
                {/* Tables that show stat/move/trait information on the persona*/}
                <div>
                    <h2 style={{display: 'flex', justifyContent:'center', alignItems: 'center'}}>Trait</h2>
                    <MakeTrait persona = {persona} /><br />
                    
                    <h2 style={{display: 'flex', justifyContent:'center', alignItems: 'center'}}>Skills</h2>
                    <MakeSkillTable persona = {persona}/><br />
                    
                    <h2 style={centered}>Resistances</h2>
                    <ResistGrid persona = {persona} /><br />

                    <h2 style={centered}>Stats</h2>
                    <StatGrid persona = {persona} /> <br />
                </div>

                {/*Tables that show fusion information on this persona */}
                <div class='gridSplit' style={{paddingBottom: 25}}>

                    {/* The grid on the bottom left*/}
                    <div class="floatLeft">                          
                        <MakeFormTable persona = {persona} />
                    </div>

                    {/* The grid on the bottom right*/}
                    <div class ="floatRight" > 
                        <MakeFuseWithTable persona = {persona} />
                    </div>
                </div>
            </div>
        </div>
    )
}

//helper function to make code more readable 
function MakeFuseWithTable(props)
{
    return(
        <div style={{paddingRight: 15}}>
            <h2 style={centered}>Fusion with</h2>
            <div style={{outline: "thin solid black"}}>
                <MakeFuseWith persona = {props.persona} />
            </div>
        </div>
    )
}

//helper function to make code more readable
function MakeFormTable(props)
{
    return (    
        <div style={{paddingLeft: 15}}>
            <h2 style={centered}>Recipe(s)</h2>
            <div style={{outline: "thin solid black"}}>
                <MakeFormulas persona = {props.persona}/>
            </div>
        </div>
    )
}

//Makes the header of the page. This includes persona name, arcana, base level, and inherit type
function MakeHeader(props)
{
    return(
        <div>
            <h1 style = {headerStyle}>
                {props.persona.name} ({props.persona.level}/{data.getArcana(props.persona.arcana)})
            </h1>
            <h2 style = {headerStyle}>Inherits: {data.getType(props.persona.inherits)}</h2>
        </div>
    )
}

//Makes the trait table
function MakeTrait(props)
{
    return(
        <div style={centered}>
            <TableContainer style={{outline: 'thin solid black'}} className={classes.table}>
                <Table>
                    <TableHead style={{backgroundColor: "LightPink"}}>
                        <TableRow>
                            <TableCell>
                                <b>Trait Name</b>
                            </TableCell>
                            <TableCell>
                                <b>Effect</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow style={{borderTopColor: "black", borderTop: "solid", borderTopWidth: 2}}>
                            <TableCell>
                                {props.persona.trait.name}
                            </TableCell>
                            <TableCell>
                                {props.persona.trait.effect}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

//Makes the table of all the skills/moves the persona has
function MakeSkillTable(props)
{
    let list = props.persona.skillList
    return(
        <div style={centered}>
            <TableContainer style={{outline: "thin solid black"}} className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow style={{backgroundColor: "PaleGreen"}}>
                            <TableCell><b>Level</b></TableCell>
                            <TableCell><b>Skill</b></TableCell>
                            <TableCell><b>Cost</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((item) =>(
                            <TableRow style={{borderTopColor: "thin solid black", borderTop: "solid", borderTopWidth: 2}}>
                                {/* {console.log(item)} */}
                                <TableCell>{item.level}</TableCell>
                                <TableCell>{item.skill.name}</TableCell>
                                <TableCell>{getSkillCost(item.skill.cost)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

//Makes the resist table
function ResistGrid(props)
{
    let count = 1;
    return(
        <div style ={centered}>
            <TableContainer style={{outline: 'thin solid black'}} className={classes.table}>
                <Table >
                    <TableHead>
                        <TableRow style={{backgroundColor: "LightBlue"}}>
                            <TableCell><b>Physical</b></TableCell>
                            <TableCell><b>Gun</b></TableCell>
                            <TableCell><b>Fire</b></TableCell>
                            <TableCell><b>Ice</b></TableCell>
                            <TableCell><b>Lightning</b></TableCell>
                            <TableCell><b>Wind</b></TableCell>
                            <TableCell><b>Psychic</b></TableCell>
                            <TableCell><b>Nuclear</b></TableCell>
                            <TableCell><b>Bless</b></TableCell>
                            <TableCell><b>Curse</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow style={{borderTopColor: "black", borderTop: "solid", borderTopWidth: 2}}>
                            {props.persona.res.map((resist) =>(
                                <TableCell key={"resistance" + (count++)}>{data.getRes(resist)}</TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

//Makes the stats grid
function StatGrid(props)
{
    let count = 1
    return (
        <div style={centered}>
            <TableContainer style={{outline: "thin solid black"}} className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow style={{backgroundColor: "plum"}}>
                            <TableCell><b>Strength</b></TableCell>
                            <TableCell><b>Magic</b></TableCell>
                            <TableCell><b>Endurance</b></TableCell>
                            <TableCell><b>Agility</b></TableCell>
                            <TableCell><b>Luck</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow style={{borderTopColor: "black", borderTop: "solid", borderTopWidth: 2}}>
                            {props.persona.stats.map((stat)=>(
                                <TableCell key={"Stat" + (count++)}>{stat}</TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

//Makes a list of all direct ways to fuse to this persona. This is the table on the bottom left.
function MakeFormulas(props){
    const[ page, changePage] = useState(1)
    let count = 0
    const recipeList = data.findFusions(props.persona)

    if(recipeList === null)
        return(<p>Treasure Demons cannot be fused to</p>)
    if(recipeList[0].first === undefined)
        return(advancedRow(recipeList))
    
    let dispArr = []
    let ix = 0

    for(let i = tableMax*(page - 1); i < page*tableMax && i < recipeList.length; i++, ix++)
    {
        dispArr[ix] = recipeList[i]
    }
    
    const maxPage = Math.ceil(recipeList.length / tableMax)
    
    return(
        <TableContainer>
            <div style={{backgroundColor: "white"}}>
                <Button variant="outlined" onClick={() => PrevPage(page, changePage)}> {'<'} </Button>
                <Button variant="outlined" onClick={() => NextPage(page, maxPage, changePage)}> {'>'} </Button>
                <div style={{borderBottomColor: "black", borderBottom: "solid", borderBottomWidth: 2}}> Page {page}/{maxPage}</div>
            </div>
            <Table>
                <TableHead>
                    <TableRow style={{backgroundColor: "Khaki", borderBottomColor: "black", borderBottom: "solid", borderBottomWidth: 3}}>
                        <TableCell><b>Persona 1</b></TableCell>
                        <TableCell><b>Persona 2</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dispArr.map((recipe)=>(
                        <TableRow key={"row " + count} style={getRowStyle(count)}>
                            <TableCell key={"first" + count}>
                                <Link to={"/persona/" + recipe.first.name}>
                                    {recipe.first.name + ' lv.' + recipe.first.level}
                                </Link>
                            </TableCell>
                            <TableCell key={"second" + count++}>
                                <Link to={"/persona/" + recipe.second.name}>
                                    {recipe.second.name + ' lv.' + recipe.second.level}
                                </Link> 
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function NextPage(page, maxPage, changePage)
{
    if(page === maxPage)
        return
    
    changePage( page + 1)
}

function PrevPage(page, changePage)
{
    if(page === 1)
        return
    
    changePage(page - 1)
}

//Makes a table for the recipe for an advanced persona
function advancedRow(recipeList)
{
    console.log(recipeList)

    let list = []
    
    for(let i = 0; i < recipeList.length; i++)
    {
        list.push(data.findPersona(recipeList[i]))
    }

    console.log(list)

    return (
        <TableContainer className={classes.smallTable}>
            <Table>
                <TableRow>
                    {list.map((pers) => (
                        <TableCell>
                            <li>
                                <Link to={"/persona/" + pers}>
                                    {pers.name} lvl.{pers.level}
                                </Link>
                            </li>
                        </TableCell>
                    ))}
                </TableRow>
            </Table>
        </TableContainer>
    )
}

/* This is the function for the grid at the bottem right of the page.
    It will make the grid that will display the result of fusing the 
    current persona with another one.*/
class MakeFuseWith extends React.Component
{
    list = [];
    constructor(props)
    {
        super(props)
        this.list = data.fuseAll(this.props.persona)
        let maxP = Math.ceil(this.list.length / tableMax)
        this.state = {page: 1, maxPage: maxP}
    }

    nextPage()
    {
        if(this.state.page === this.state.maxPage)
            return

        let newPage = this.state.page + 1
        this.setState({page: newPage})
    }

    prevPage()
    {
        if(this.state.page === 1)
            return
        
        let newPage = this.state.page - 1
        this.setState({page: newPage})
    }

    render(){

        let count = 1
        let val = []
        let ix = 0
        for(let i = tableMax*(this.state.page - 1); i < this.state.page*tableMax && i < this.list.length; i++, ix++)
        {
            val[ix] = this.list[i]
        }

        // let width = (window.screen.width / 2) - sidePadding
        return(
            <TableContainer >
                <div style={{backgroundColor: "white"}}>
                    <Button variant="outlined" onClick={() => this.prevPage()}> {'<'} </Button>
                    <Button variant="outlined" onClick={() => this.nextPage()}> {'>'} </Button>
                    <div style={{borderBottomColor: "black", borderBottom: "solid", borderBottomWidth: 2}}> Page {this.state.page}/{this.state.maxPage}</div>
                </div>
                <Table>
                    <TableHead>
                        <TableRow style={{backgroundColor: 'rgb(255, 153, 51)', borderBottomColor: "black", borderBottom: "solid", borderBottomWidth: 3}}>
                            
                            <TableCell><b>Fuse {this.props.persona.name} with</b></TableCell>
                            <TableCell><b>You will get</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                         {val.map((fusion)=>(
                        <TableRow style={getRowStyle(count++)}>
                            <TableCell>
                                <Link to={"/persona/" + fusion.fuser.name}>
                                    {fusion.fuser.name} lvl.{fusion.fuser.level}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Link to={"/persona/" + fusion.result.name}>
                                    {fusion.result.name} lvl.{fusion.result.level}
                                </Link>
                            </TableCell>
                        </TableRow>             
                        ))} 
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

function getSkillCost(cost)
{
    if(cost.charAt(cost.length - 1) === '%')
        return (cost + " HP")
    else if(cost.charAt(0) !== '-')
        return (cost + " SP")
    else
        return cost
}

export default Detailed