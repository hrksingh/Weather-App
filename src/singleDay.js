import icons from "./weatherIcons.js";
import tempIcon from "/data-icons/temp-icon.svg";
import dewIcon from "/data-icons/dew-icon.svg";
import windIcon from "/data-icons/wind-icon.svg";
import UVIndexIcon from "/data-icons/uvindex-icon.svg";
import humidityIcon from "/data-icons/humidity-icon.svg";
import precipIcon from "/data-icons/precip-icon.svg";
import hourTempIcon from "/data-icons/thermometer.svg";

const singleDayPage = (function () {
  const contentDiv = document.querySelector(".content");
  const usUnit = "mph";
  const metricUnit = "kph";
  let windUnit = usUnit;
  const conditionIcons = icons;
  const timeList = [
    "12am",
    "1am",
    "2am",
    "3am",
    "4am",
    "5am",
    "6am",
    "7am",
    "8am",
    "9am",
    "10am",
    "11am",
    "12pm",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
    "8pm",
    "9pm",
    "10pm",
    "11pm",
  ];

  function createElement(element, className = null) {
    const ele = document.createElement(element);
    if (className !== null) {
      ele.classList.add(className);
    }
    return ele;
  }

  function getDegree() {
    const span = createElement("span", "degree");
    span.textContent = "°";
    return span;
  }

  function createTempSummary(hrData) {
    const tempDiv = createElement("div", "temp-div");

    const tempPara = createElement("p", "summary-temp");
    tempPara.textContent = `${Math.round(hrData.temp)}`;
    tempPara.appendChild(getDegree());
    tempPara.classList.add("degree-holder");
    tempDiv.appendChild(tempPara);

    const feelsLikeText = createElement("p");
    feelsLikeText.textContent = "Feels Like";
    tempDiv.appendChild(feelsLikeText);

    const feelsLikePara = createElement("p", "feels-like");
    feelsLikePara.textContent = `${Math.round(hrData.feelslike)}`;
    feelsLikePara.appendChild(getDegree());
    feelsLikePara.classList.add("degree-holder");
    tempDiv.appendChild(feelsLikePara);

    return tempDiv;
  }

  function createIconSummary(hrData) {
    const div = createElement("div", "summary-icon");

    const img = createElement("img", "summary-icon-img");
    img.src = conditionIcons[hrData.icon];
    div.appendChild(img);

    const descriptionPara = createElement("p", "summary-description");
    descriptionPara.textContent = hrData.conditions;
    div.appendChild(descriptionPara);

    return div;
  }

  function createSummary(hrData) {
    const div = createElement("div", "summary");
    div.appendChild(createTempSummary(hrData));
    div.appendChild(createIconSummary(hrData));
    return div;
  }

  function createDataItem(img, title, data, deg = false) {
    const div = createElement("div", "data-item");

    div.appendChild(img);

    const titlePara = createElement("p", "data-title");
    titlePara.textContent = title;
    div.appendChild(titlePara);

    const dataPara = createElement("p", "data-data");
    dataPara.innerText = data;
    if (deg) {
      dataPara.appendChild(getDegree());
      dataPara.classList.add("degree-holder");
    }
    div.appendChild(dataPara);

    return div;
  }

  function createDataTempItem(img, title, min, max) {
    const div = createElement("div", "data-item");

    div.appendChild(img);

    const titlePara = createElement("p", "data-title");
    titlePara.textContent = title;
    div.appendChild(titlePara);

    const dataPara = createElement("p", "data-data");
    dataPara.innerHTML = `${Math.round(
      max
    )}<span class="degree">°</span> &nbsp;/${Math.round(
      min
    )}<span class="degree">°</span>`;
    dataPara.classList.add("degree-holder");
    div.appendChild(dataPara);

    return div;
  }

  function createDataSection(tempMin, tempMax, hrData) {
    const div = createElement("div", "data");

    const tempImg = createElement("img", "data-img");
    tempImg.src = tempIcon;
    div.appendChild(createDataTempItem(tempImg, "High/Low:", tempMin, tempMax));

    const windImg = createElement("img", "data-img");
    windImg.src = windIcon;
    div.appendChild(
      createDataItem(
        windImg,
        "Wind:",
        `${Math.round(hrData.windspeed)} ${windUnit}`
      )
    );

    const humidImg = createElement("img", "data-img");
    humidImg.src = humidityIcon;
    div.appendChild(
      createDataItem(humidImg, "Humidity:", `${Math.round(hrData.humidity)}%`)
    );

    const dewImg = createElement("img", "data-img");
    dewImg.src = dewIcon;
    div.appendChild(
      createDataItem(dewImg, "Dew Point:", `${Math.round(hrData.dew)}`, true)
    );

    const uvIndexImg = createElement("img", "data-img");
    uvIndexImg.src = UVIndexIcon;
    div.appendChild(
      createDataItem(uvIndexImg, "UV Index:", `${hrData.uvindex}/10`)
    );

    const precipImg = createElement("img", "data-img");
    precipImg.src = precipIcon;
    div.appendChild(
      createDataItem(
        precipImg,
        "Precipitation:",
        `${Math.round(hrData.precipprob)}%`
      )
    );

    return div;
  }

  function createHourTempData(hour) {
    const div = createElement("div", "hour-temp");

    const tempImg = createElement("img", "hour-temp-img");
    tempImg.src = hourTempIcon;
    div.appendChild(tempImg);

    const tempPara = createElement("p", "hour-temp-data");
    tempPara.textContent = Math.round(hour.temp);
    tempPara.appendChild(getDegree());
    tempPara.classList.add("degree-holder");
    div.appendChild(tempPara);

    return div;
  }

  function createHourPrecipData(hour) {
    const div = createElement("div", "hour-precip");

    const precipImg = createElement("img", "hour-precip-img");
    precipImg.src = precipIcon;
    div.appendChild(precipImg);

    const precipPara = createElement("p", "hour-precip-data");
    precipPara.textContent = `${Math.round(hour.precipprob)}%`;
    div.appendChild(precipPara);

    return div;
  }

  function createHourData(time, hour) {
    const div = createElement("div", "hour-data");

    const timePara = createElement("p", "hour-time");
    timePara.textContent = time;
    div.appendChild(timePara);

    const imgContainer = createElement("div", "hour-img-div");
    const conditionImg = createElement("img", "hour-img");
    conditionImg.src = conditionIcons[hour.icon];
    imgContainer.appendChild(conditionImg);
    div.appendChild(imgContainer);

    div.appendChild(createHourTempData(hour));
    div.appendChild(createHourPrecipData(hour));

    return div;
  }

  function createHourlySection(hourlyData) {
    const div = createElement("div", "hourly-data");

    for (let i = 0; i < hourlyData.length; i += 1) {
      const hour = hourlyData[i];
      const time = timeList[i];
      div.appendChild(createHourData(time, hour));
    }
    return div;
  }

  function createPage(local, tempMin, tempMax, hrData, dayData, us = true) {
    windUnit = us ? usUnit : metricUnit;

    const localH1 = createElement("h1", "local");
    localH1.textContent = local;
    contentDiv.appendChild(localH1);

    const pageDiv = createElement("div", "single-page");
    pageDiv.appendChild(createSummary(hrData));
    pageDiv.appendChild(createDataSection(tempMin, tempMax, hrData));
    pageDiv.appendChild(createHourlySection(dayData));

    contentDiv.appendChild(pageDiv);
  }

  return {
    createPage: createPage,
    windUnit: windUnit,
  };
})();

export default singleDayPage;
