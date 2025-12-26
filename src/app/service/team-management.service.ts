import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';

const ADDTEAM='/rcs-reseller-service/addTeams';
const GETTEAM='/rcs-reseller-service/getAllTeams';
const ADDAGENT='/rcs-reseller-service/addAgents';
const GETALLAGENTS='/rcs-reseller-service/getAllAgents';

@Injectable({
  providedIn: 'root'
})
export class TeamManagementService {
  addTeam(team: any) {
    const headers = new HttpHeaders({
        "Authorization": `${sessionStorage.getItem('TOKEN')}`,
        "Content-Type": "application/json"
    });
    const URL = `${BASE_URL}${ADDTEAM}`;
    return this.https.post<any>(URL, JSON.stringify(team), { headers });
  }
  getTeam() {
    const headers = new HttpHeaders({
        "Authorization": `${sessionStorage.getItem('TOKEN')}`,
        "Content-Type": "application/json"
    });
    const URL = `${BASE_URL}${GETTEAM}?loggedInUserName=${sessionStorage.getItem('USER_NAME')}`;
    return this.https.get<any>(URL, { headers });
  }

  addAgent(agent: any) {
    const headers = new HttpHeaders({
        "Authorization": `${sessionStorage.getItem('TOKEN')}`,
        "Content-Type": "application/json"
    });
    const URL = `${BASE_URL}${ADDAGENT}`;
    return this.https.post<any>(URL, JSON.stringify(agent), { headers });
  }
  getAllAgents() {
    const headers = new HttpHeaders({
        "Authorization": `${sessionStorage.getItem('TOKEN')}`,
        "Content-Type": "application/json"
    });
    const URL = `${BASE_URL}${GETALLAGENTS}?loggedInUserName=${sessionStorage.getItem('USER_NAME')}`;
    return this.https.get<any>(URL, { headers });
  }

  constructor(private https : HttpClient) { }
}
