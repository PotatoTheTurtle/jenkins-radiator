import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import "../css/table.css"
import {getAllGroups, putRadiatorSettings} from "../services/radiator"
import {SaveButton} from "../common/Buttons"
import {useHistory} from "react-router-dom"
import {useTranslation} from "react-i18next"

const AdminRadiatorSettings = ({radiatorData}) => {

  const [allRadiatorGroups, setAllRadiatorGroups] = useState([])
  const [groupsToAdd, setGroupsToAdd] = useState([])
  const [radiatorJson, setRadiatorJson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [radiatorStatus, setRadiatorStatus] = useState(null)
  const history = useHistory()
  const { t, i18n } = useTranslation();

  useEffect(async () => {
    radiatorData.then((response) => {
      console.log(response)
      setRadiatorJson(response)
      setGroupsToAdd(response.groups.map((group) => group.id))
    }).catch((error) => {
      setRadiatorStatus(error)
    })

    await getAllGroups()
      .then(response => setAllRadiatorGroups(response))
      .catch(() => setAllRadiatorGroups([]))

    setLoading(false)
  }, [])

  const handleAdditionOfGroups = async () => {
    await putRadiatorSettings({...radiatorJson, owner: radiatorJson.owner.id, groups: groupsToAdd})
    history.push("/admin/home/")
  }

  const handleCheckboxChange = (event) => {
    const target = event.target
    if(target.checked){
      setGroupsToAdd([...groupsToAdd, target.value])
    }else{
      setGroupsToAdd(groupsToAdd.filter((id) => id !== target.value))
    }
  }

  if(radiatorStatus){
    return(
      <div>
        <img style={{display: "block", marginLeft: "auto", marginRight: "auto", width: "50%"}} src={"https://http.cat/" + radiatorStatus} alt={"http error"}/>
      </div>
    );
  }

  if(loading){
    return(
    <div>
      {t("loading")}
    </div>
    )
  }

  return(
    <div style={{margin: "auto", width: "50%", textAlign: "center"}}>
      <form onSubmit={handleAdditionOfGroups}>
        <table style={{marginLeft: "auto", marginRight: "auto"}} className="layout display responsive-table">
          <thead>
          <tr>
            <th/>
            <th>{t("name")}</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {
            allRadiatorGroups.map((group, index) => {
              return(
                <tr key={index}>
                  <td className="check-box-col"><input
                    type={"checkbox"}
                    onChange={handleCheckboxChange}
                    name={group.title}
                    value={group.id}
                    checked={groupsToAdd.includes(group.id)}
                  /></td>
                  <td className="title-col">{group.title}</td>
                  <td className="title-col"><Link key={index} to={`/admin/group/${group.id}`}>Edit</Link></td>
                </tr>
              )}
            )
          }
          </tbody>
        </table>
      </form>
      <SaveButton saveHandle={handleAdditionOfGroups} />
    </div>
  );
}

export default AdminRadiatorSettings;