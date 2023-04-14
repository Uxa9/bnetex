module.exports = (data, close, log = false) => {
    
    let zones = [...data.zones];

    zones.push(close);

    zones = zones.sort((a,b) => a - b);
    
    let currentZone = zones.indexOf(close);

    data.zone = currentZone;
    

    return data;

}