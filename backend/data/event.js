const { v4: generateId } = require("uuid");

const { NotFoundError } = require("../util/errors");
const { readData, writeData } = require("./util");

async function getAll() {
  const storedData = await readData();
  if (!storedData.events) {
    throw new NotFoundError("이벤트를 찾을 수 없습니다.");
  }
  return storedData.events;
}

async function get(id) {
  const storedData = await readData();
  if (!storedData.events || storedData.events.length === 0) {
    throw new NotFoundError("이벤트를 찾을 수 없습니다.");
  }

  const event = storedData.events.find((ev) => ev.id === id);
  if (!event) {
    throw new NotFoundError("ID에 대한 이벤트를 찾을 수 없습니다: " + id);
  }

  return event;
}

async function add(data) {
  const storedData = await readData();
  storedData.events.unshift({ ...data, id: generateId() });
  await writeData(storedData);
}

async function replace(id, data) {
  const storedData = await readData();
  if (!storedData.events || storedData.events.length === 0) {
    throw new NotFoundError("이벤트를 찾을 수 없습니다.");
  }

  const index = storedData.events.findIndex((ev) => ev.id === id);
  if (index < 0) {
    throw new NotFoundError("ID에 대한 이벤트를 찾을 수 없습니다: " + id);
  }

  storedData.events[index] = { ...data, id };

  await writeData(storedData);
}

async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.events.filter((ev) => ev.id !== id);
  await writeData({ ...storedData, events: updatedData });
}

exports.getAll = getAll;
exports.get = get;
exports.add = add;
exports.replace = replace;
exports.remove = remove;
