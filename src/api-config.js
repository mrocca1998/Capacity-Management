let backendHost;

const hostname = window.location.hostname;

if(hostname === 'tstsrvstub01') {
  backendHost = 'http://tstsrvstub01:1167/CapacityManagerApi/';
} else if(hostname === 'localhost') {
  backendHost = 'https://localhost:44391/';
}

export const API_ROOT = `${backendHost}api/`;