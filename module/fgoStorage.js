var FGO_STORAGE = "FGO_Storage";

function getData(configName) {
  const item = localStorage.getItem(configName);
  return item == null ? [] : JSON.parse(item);
}

function setData(configName, configContent) {
  if (configContent)
    localStorage.setItem(configName, JSON.stringify(configContent));
}

function deleteData(configName) {
  localStorage.removeItem(configName);
}

function updateData(units) {
  if (!units) return;

  //store units where np >= 0
  let newData = units.flat(2).filter((x) => x.npLv >= 0);

  if (!newData || newData.length == 0) return;

  const currentData = getData(FGO_STORAGE);

  if (currentData.length == 0) {
    setData(FGO_STORAGE, newData);
    return;
  }

  let storage = [];

  //Step1. update storage if exist
  cLoop: for (let i = 0; i < currentData.length; i++) {
    for (let j = 0; j < newData.length; j++) {
      if (newData[j].no && newData[j].no == currentData[i].no) {
        if (newData[j].npLv > 0) {
          storage.push(newData[j]);
        }
        continue cLoop;
      }
    }

    storage.push(currentData[i]);
  }

  //Step2. add new
  nLoop: for (let i = 0; i < newData.length; i++) {
    for (let j = 0; j < storage.length; j++) {
      if (storage[j].no && newData[i].no == storage[j].no) {
        //already added in Step1.
        continue nLoop;
      }
    }

    storage.push(newData[i]);
  }

  setData(FGO_STORAGE, storage);
}

function updateUnitsNPLevel(units) {
  const fgoStorage = getData(FGO_STORAGE);
  if (fgoStorage.length == 0) {
    console.log("data is empty");
  } else {
    for (let i = 0; i < units.length; i++) {
      for (let j = 0; j < units[i].length; j++) {
        for (let k = 0; k < fgoStorage.length; k++) {
          if (units[i][j].no && units[i][j].no == fgoStorage[k].no) {
            units[i][j].npLv = fgoStorage[k].npLv;
          }
        }
      }
    }
  }
}

function addUnitsNo(units) {
  for (let i = 0; i < units.length; i++) {
    for (let j = 0; j < units[i].length; j++) {
      units[i][j].no = units[i][j].imageUrl.split("/").pop().split(".")[0];
    }
  }
}
