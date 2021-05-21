import React from 'react';
import './App.css';
import './Data/PersonaData.js'
import {Table, TextField, } from '@material-ui/core'
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Link} from "react-router-dom";

const centerStyle = {
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center"
}

const headerStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "DarkGray"
}
const weakStyle={color: "red"}
const normalStyle={}
const resistStyle={color: "Yellow"}
const nullStyle={color: "mediumBlue"}
const repelStyle={color: "chocolate"}
const absorbStyle={color: "green"}

const data = require('./Compendium.js')
const newData = require('./Data/PersonaData.js')

//The pre-sorted lists
const byArcana = newData.byArcana
const byLevel = newData.byLevel
const alphabatized = data.alphabetized
const byInherits = data.byInherits

const getArcana = data.getArcana
const getRes = data.getRes

let listCount = 0;
var listDisplayed = []
function App(props) {
  return (
      <PersonaGrid list = {byLevel} displaying = 'byLevel' style={{color:'white'}} key="Grid"/>
  );   
}

class PersonaGrid extends React.Component
{
  constructor(props){
    super(props)
    this.noSearchList = props.list
    this.listToDisplay = this.noSearchList
    listDisplayed = byLevel
    this.state = {sortBy: "level", search: "", reverse: false}
  }

  search(){
    let string = document.getElementById('searchBar').value
    this.setState({search: string})
  }

  makeHeadRow(props){
    let res = Object.values(props)
    return(
      <TableRow key="Head" style={{backgroundColor: "lightblue", borderBottomColor: "black",
        borderBottom: "solid", borderBottomWidth: 2}}>
        <TableCell key="sortByLevel">
          <button onClick = {() => this.buttonClicked("level")}>
            Level
          </button>
        </TableCell>
        <TableCell key="sortByAlphabetized">
          <button onClick = {() => this.buttonClicked("alphabet")}>
            Name
          </button>
        </TableCell>
        <TableCell key="sortByArcana">
          <button onClick = {() => this.buttonClicked("arcana")}>
            Arcana
          </button>
        </TableCell>
        <TableCell key="sortByInherits">
          <button onClick = {() => this.buttonClicked("Inherits")}> 
            Inherits
          </button>
        </TableCell>
        {res.map((element) => (
          <TableCell key={element}>
            <button onClick = {() => (this.state.sortBy === "Resistant" && !this.state.reverse && this.state.resClicked === res.indexOf(element)? 
                                        this.setState({reverse: true}):
                                        this.setState({sortBy: "Resistant", reverse: false, resClicked: res.indexOf(element)})
                                     )
                              }>
              {element}
            </button>
          </TableCell>
        ))}
      </TableRow> 
    )
  }

  buttonClicked(buttonPressed, element = undefined)
  {
     (this.state.sortBy === buttonPressed && !this.state.reverse ? 
        this.setState({reverse: true}) : //true
        this.setState({sortBy: buttonPressed, reverse: false})//false
      )
  }

  resSort(resNum)
  {
    console.log("ResSort")
    console.log(resNum)
    let temp = []
    let curr = byLevel

    console.log(curr)

    for(let i = 0; i < curr.length; i++)
    {
      temp.push(curr[i])
    }

    let tempPers
    for(let i = 0; i < temp.length; i++)
    {
      for(let j = i; j < temp.length; j++)
      {
        if(temp[i].res[resNum] < temp[j].res[resNum])
        {
          tempPers = temp[j]
          temp[j] = temp[i]
          temp[i] = tempPers
        }
      }
    }
    return temp
  }

  //makes a row for the table given a props variable with the persona data
  makeRow(props){
    let count = 1
    let color = (listCount % 2 ? "slateGrey":"GainsBoro")
    let name = props.name

    if(props.treasure)
      color = "thistle"
    else if(props.advanced)
      color = "chartreuse"
    
    if(props.name.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase())){
      ++listCount
      return (
        <TableRow key={props.key} style={{backgroundColor: color}}>
          <TableCell key="personaLevel">{props.level}</TableCell>
          <TableCell key="personaName">          
            <Link to= {"/persona/" + name}>
              {name}
            </Link>
          </TableCell>
          <TableCell key="personaArcana"><b>{getArcana(props.arcana)}</b></TableCell>
          <TableCell key="inherits"> {data.getType(props.inherits)} </TableCell>

          {props.resists.map((res) => (
              <TableCell key={"Resist" + count++}><t style={this.getResColor(res)}>{getRes(res)}</t></TableCell>
            ))
          }
          
        </TableRow>
      )
    }
  }

  getResColor(num){
    switch(num)
    {
      case -1:
          return weakStyle
      case 0:
          return normalStyle
      case 1:
          return resistStyle
      case 2:
          return nullStyle
      case 3:
          return repelStyle
      case 4:
          return absorbStyle
      default:
          return normalStyle
    }
  }

  getList(){

    switch(this.state.sortBy)
    {
      case "level":
        return byLevel
      case "alphabet":
        return alphabatized
      case "arcana":
        return byArcana
      case "Resistant":
        return this.resSort(this.state.resClicked)
      case "Inherits":
        return byInherits
    }
  }

  //If a button in the table header is pressed twice 
  //the list displayed will need to be reversed
  reverseList(list)
  {
    for(let i = 0; i < list.length; i++)
    {
      if(list[i].constructor === Array)
      {
        list[i] = this.reverseList(list[i]) //recursive call
      }
    }

    let leftIx = 0
    let rightIx = list.length - 1

    while(leftIx < rightIx)
    {
      let temp = list[leftIx]
      list[leftIx] = list[rightIx]
      list[rightIx] = temp

      leftIx++; rightIx-- 
    }

    return list
  }

  render(){

    let timeOut 
    let list = this.getList()
    
    if(this.state.reverse)
    {
      this.reverseList(list)
    }

    let val

    /* if the list array is not 2 dimensional*/
    if(list[0].constructor !== Array)
    {
      val = (
        list.map((persona) => (
          this.makeRow({name: persona.name, level: persona.level, 
              arcana: persona.arcana, resists: persona.res, 
              stats: persona.stats , key: persona.name, 
              treasure: persona.treasure, advanced: persona.advanced,
              inherits: persona.inherits}
          )  
        ))
      )
    }
    else
    {
      val = (
        list.map((row) => (
          row.map((persona) =>
            this.makeRow({name: persona.name, level: persona.level, 
              arcana: persona.arcana, resists: persona.res, 
              stats: persona.stats , key: persona.name, 
              treasure: persona.treasure, advanced: persona.advanced,
              inherits: persona.inherits}
            )
          )
        ))
      )
    }
    
    return(
      <div style ={{paddingLeft: 25, paddingRight: 25, paddingTop: 15, paddingBottom: 15, backgroundColor: "black" }}>
        <div style={{backgroundColor:'black' }}>
          <div style={{backgroundColor: "DarkGray", textAlign: "center"}}>
            <h2 style={{color: 'black'}}>Persona 5 royal fusion calculator</h2>

            <Link to={"/Skills/"}>Skills</Link><br />
            
            <TextField id ="searchBar" label="Search" variant="outlined" size='small' onKeyUp = {(event) => {
              clearTimeout(timeOut);
              timeOut = setTimeout(() => {
                this.search(document.getElementById('searchBar').value)}, 350)
              }}
            />
          </div>

          <div>
            <Table style={{padding: 0}}>
              {/*Head of the table*/}
              <TableHead>
                {this.makeHeadRow({phy: 'Physical', gun: 'Gun', fire: 'Fire', ice: "Ice", elec: "Lightning", 
                  wind: 'Wind', nuc: 'Nuclear', psy: 'Psychic', bles: 'Bless', cur: 'Curse'})}
              </TableHead>

              {/*Body of the table*/}
              <TableBody>
                {val}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }
}

export default App;