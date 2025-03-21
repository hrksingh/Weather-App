import icons from "./weatherIcons.js";
import tempIcon from "/data-icons/thermometer.svg";
import precipIcon from "/data-icons/precip-icon.svg";
import { format } from "date-fns";

const forecast = (function () {
  const conditionIcons = icons;
  const contentDiv = document.querySelector(".content");

  function createElement(element, className = null) {
    const ele = document.createElement(element);
    if (className !== null) {
      ele.classList.add(className);
    }
    return ele;
  }

  function correctDate(date) {
    date = new Date(date);
    return new Date(
      date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
    );
  }

  function createTempData(max, min) {
    const div = createElement("div", "day-temp");

    const tempImg = createElement("img", "day-temp-img");
    tempImg.src = tempIcon;
    div.appendChild(tempImg);

    const tempPara = createElement("p", "day-temp-data");
    tempPara.innerHTML = `${Math.round(
      max
    )}<span class="degree">°</span> &nbsp;/${Math.round(
      min
    )}<span class="degree">°</span>`;
    tempPara.classList.add("degree-holder");
    div.appendChild(tempPara);

    return div;
  }

  function createPrecipData(rainChance) {
    const div = createElement("div", "day-precip");

    const precipImg = createElement("img", "day-precip-img");
    precipImg.src = precipIcon;
    div.appendChild(precipImg);

    const precipPara = createElement("p", "day-precip-data");
    precipPara.textContent = `${Math.round(rainChance)}%`;
    div.appendChild(precipPara);

    return div;
  }

  function createConditionSection(dayData) {
    const div = createElement("div", "condition-section");

    const imgContainer = createElement("div", "day-img-div");
    const dayImg = createElement("img", "day-img");
    dayImg.src = conditionIcons[dayData.icon];
    imgContainer.appendChild(dayImg);
    div.appendChild(imgContainer);

    const dataSection = createElement("div", "day-data");
    dataSection.appendChild(createTempData(dayData.tempmax, dayData.tempmin));
    dataSection.appendChild(createPrecipData(dayData.precipprob));
    div.appendChild(dataSection);

    return div;
  }

  function createDayCard(dayData) {
    const dayCard = createElement("div", "day-card");

    const datePara = createElement("p", "day-date");
    datePara.textContent = format(correctDate(dayData.datetime), "E d");
    dayCard.appendChild(datePara);

    dayCard.appendChild(createConditionSection(dayData));

    const descriptionPara = createElement("p", "day-description");
    descriptionPara.textContent = dayData.description;
    dayCard.appendChild(descriptionPara);

    return dayCard;
  }

  function createPage(days, local) {
    const localH1 = createElement("h1", "local");
    localH1.textContent = local;
    contentDiv.appendChild(localH1);

    const forecastPage = createElement("div", "forecast-page");

    for (let dayData of days) {
      forecastPage.appendChild(createDayCard(dayData));
    }

    contentDiv.appendChild(forecastPage);
  }

  return {
    createPage: createPage,
  };
})();

export default forecast;
