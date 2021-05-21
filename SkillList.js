import { Skill } from './Data/GeneralData'
import React from 'react'
import {Table, TableContainer ,TextField, } from '@material-ui/core'
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Link} from "react-router-dom";

let skillData = require('./Data/SkillData')
let list = skillData.skillList;

function SkillList(props)
{ 
    let count = 1;
    return(
        <div style = {{paddingLeft: 25, paddingRight: 25, paddingTop: 15, paddingBottom: 15, backgroundColor: "black"}}>
            <div style={{textAlign: "center", backgroundColor: "darkgray"}}>
                <h1>Skills</h1>
                <Link to={"/"}>Personas</Link>
            </div>
            <TableContainer>
                <Table>
                    <TableHead style={{backgroundColor: "lightblue"}}>
                        <TableRow style={{borderBottomColor: "black", borderBottom: "solid", borderBottomWidth: 2}}>
                            <TableCell>
                                <b>Type</b>
                            </TableCell>
                            <TableCell>
                                <b>Name</b>
                            </TableCell>
                            <TableCell>
                                <b>Description</b>
                            </TableCell>
                            <TableCell>
                                <b>Cost</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((row) =>(
                            row.map((skill) =>(
                                <TableRow style={(count++)%2 ? {backgroundColor: "slateGrey"} : {backgroundColor: "gainsboro"}}>
                                    <TableCell>
                                        {getSkillType(skill.type)}
                                    </TableCell>
                                    <TableCell>
                                        {skill.name}
                                    </TableCell>
                                    <TableCell>
                                        {skill.effect}
                                    </TableCell>
                                    <TableCell>
                                        {getSkillCost(skill.cost)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
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

function getSkillType(num)
{
    switch(num)
    {
        case 0:
            return "Phy"
        case 1:
            return 'Gun'
        case 2:
            return 'Fire'
        case 3: 
            return 'Ice'
        case 4:
            return 'Lightning'
        case 5:
            return 'Wind'
        case 6:
            return 'Psy'
        case 7:
            return 'Nuke'
        case 8:
            return 'Bless'
        case 9:
            return 'Curse'
        case 10:
            return 'Almighty'
        case 11:
            return 'Ailment'
        case 12:
            return 'Heal'
        case 13:
            return 'Support'
        case 14:
            return 'Passive'
    }
}

export default SkillList