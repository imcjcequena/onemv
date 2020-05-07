import { observable } from 'mobx';

class MVStore {
  Store = observable({
    profile: {},
    nextTrip: {},
    todayTrips: {},
    futureTrips: {},
    recentTrips: {},
    divisionLogo: null,
    divisionLogoWhite: null,
  })

  setProfile = (profile) => { this.profile = profile; }

  setNextTrip = (trip) => { this.nextTrip = trip; }

  setTodayTrips = (trips) => { this.todayTrips = trips; }

  setFutureTrips = (trips) => { this.futureTrips = trips; }

  setRecentTrips = (trips) => { this.recentTrips = trips; }

  setDivisionLogo = (logoUrl) => { this.divisionLogo = logoUrl; }

  setDivisionLogoWhite = (logoUrl) => { this.divisionLogoWhite = logoUrl; }

  clearDivisionLogos = () => {
    this.divisionLogo = null;
    this.divisionLogoWhite = null;
  }

  clear = () => {
    this.profile = null;
    this.nextTrip = null;
    this.todayTrips = null;
    this.futureTrips = null;
    this.recentTrips = null;
  }
}

export default MVStore;
