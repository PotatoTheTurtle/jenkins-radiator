const express = require("express");
const expressRouter = express.Router();
const mongoRadiator = require("../models/radiator");
const mongoGroup = require("../models/group");
const mongoose = require("mongoose");
const config = require("../config.json");

expressRouter.use((request, response, next) => {
  if(!request.decodedToken){
    response.status(config.response.unauthorized).send({error: "Missing token"}).end()
  }
  next()
})

// Get all radiators
expressRouter.get("/", async (request, response) => {
  let query = {}

  if(request.decodedToken.permissions.read_radiators === 0 && request.decodedToken.permissions.administrator === 0){
    response.status(config.response.unauthorized).send({error: "Request doesnt not meet the permission level."}).end()
  }

  if(request.decodedToken.permissions.read_radiators === 1 && request.decodedToken.permissions.administrator === 0){
    query = {owner: request.decodedToken.id}
  }


  const radiators = await mongoRadiator.find(query)
    .populate({
      path: "groups",
      populate: {
        path: "jobs",
        populate: {
          path: "jenkins"
        }
      }
    })
    .populate({
      path: "owner"
    })
    .populate({
      path: "groups",
      populate: {
        path: "owner"
      }
    })
    .populate({
      path: "groups",
      populate: {
        path: "jobs",
        populate: {
          path: "owner"
        }
      }
    })
    .catch(() => response.status(config.response.notfound).send({error: "Radiators not found"}).end())
  response.status(config.response.ok).send(radiators).end()
})

expressRouter.get("/:id", async (request, response) => {

  if(request.decodedToken.permissions.read_radiators === 0 && request.decodedToken.permissions.administrator === 0){
    response.status(config.response.unauthorized).send({error: "Request doesnt not meet the permission level."}).end()
  }

  const radiator = await mongoRadiator.findById(request.params.id)
    .catch(() => response.status(config.response.notfound).send({error: "Radiators not found"}).end())

  if(request.decodedToken.permissions.read_radiators === 1 && radiator.owner !== request.decodedToken.id && request.decodedToken.permissions.administrator === 0){
    response.status(config.response.unauthorized).send({error: "Request doesnt not meet the permission level."}).end()
  }


  await radiator.populate({
        path: "groups",
        populate: {
          path: "jobs",
          populate: {
            path: "jenkins"
          }
        }
      })
    .populate("owner")
    .execPopulate()
  response.status(config.response.ok).send(radiator).end()
})

// Create new radiator
expressRouter.post("/", async (request, response) => {
  const body = request.body;

  if(request.decodedToken.permissions.write_radiators === 0 && request.decodedToken.permissions.administrator === 0){
    response.status(config.response.unauthorized).send({error: "Request doesnt not meet the permission level."}).end()
  }

  /*if(body.owner === undefined){
    response.status(config.response.badrequest).send({error: "Radiator owner is missing."})
  }*/

  if(!body.name){
    response.status(config.response.badrequest).send({error: "Radiator name is missing."})
  }

  const newRadiatorData = {
    name: body.name,
    groups: body.groups,
    owner: body.owner
  }

  const newRadiator = new mongoRadiator(newRadiatorData)
  await newRadiator.save();

  response.status(config.response.ok).send().end()
})

expressRouter.put("/", async (request, response) => {
  const body = request.body

  let radiator = await mongoRadiator.findById(body.id)

  if(request.decodedToken.permissions.write_radiators === 1 && radiator.owner !== request.decodedToken.id  && request.decodedToken.permissions.administrator === 0){
    response.status(config.response.unauthorized).send({error: "Request doesnt not meet the permission level."}).end()
  }
  if(request.decodedToken.permissions.write_radiators === 0 && request.decodedToken.permissions.administrator === 0){
    response.status(config.response.unauthorized).send({error: "Request doesnt not meet the permission level."}).end()
  }

  if(!body.name){
    response.status(config.response.badrequest).send({error: "Radiator name is missing."}).end()
  }

  const groupsId = body.groups.map(group => group.id)
  const formattedRadiatorGroups = {...body, groups: groupsId}

  radiator = formattedRadiatorGroups
  await radiator.save()

  if(request.decodedToken.permissions.write_groups === 0 && request.decodedToken.permissions.administrator === 0){
    response.status(config.response.unauthorized).send({error: "Request doesnt not meet the permission level."}).end()
  }

  const fromattedGroupsJobs = body.groups.map(group => {return {id: group.id, jobs: group.jobs.map(jobRow => jobRow.map(job => job.id))}})

  for(const formattedGroup of fromattedGroupsJobs){

    let group = await mongoGroup.findById(formattedGroup.id)

    if(request.decodedToken.permissions.write_groups === 1 && group.owner !== request.decodedToken.id && request.decodedToken.permissions.administrator === 0){
      response.status(config.response.unauthorized).send({error: "Request doesnt not meet the permission level."}).end()
    }

    group = formattedGroup
    await group.save()
  }

  response.status(config.response.ok).send().end()
})

expressRouter.put("/settings", async (request, response) => {
  const body = request.body

  let radiator = await mongoRadiator.findById(body.id)

  if(request.decodedToken.permissions.write_radiators === 1 && radiator.owner !== request.decodedToken.id && request.decodedToken.permissions.administrator === 0){
    response.status(config.response.unauthorized).send({error: "Request doesnt not meet the permission level."}).end()
  }
  if(request.decodedToken.permissions.write_radiators === 0 && request.decodedToken.permissions.administrator === 0){
    response.status(config.response.unauthorized).send({error: "Request doesnt not meet the permission level."}).end()
  }

  if(!body.name){
    response.status(config.response.badrequest).send({error: "Radiator name is missing."})
  }

  radiator = body
  await radiator.save()

  response.status(config.response.ok).send().end()
})


module.exports = expressRouter;