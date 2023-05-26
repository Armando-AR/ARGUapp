import { onGetTask } from "./index.js";

var calendarElement = document.getElementById("myCalendar");

var calendarInstance = new calendarJs(calendarElement, {
  exportEventsEnabled: true,
  manualEditingEnabled: true,
  showTimesInMainCalendarEvents: true,
  minimumDayHeight: 0,
  manualEditingEnabled: true
});

/*
function getEvents() {
  var events = [];
  
  var today = new Date();
    today.setDate(29);
    today.setHours(12);
    today.setMinutes(10);

    var otro = new Date();
    otro.setDate(30);
    otro.setHours(15);
    otro.setMinutes(15);


  var newEvent = {
    from: today,
    to: otro,
    title: "Evento todo el dia ",
    description:
      "This is a description of the event that has been added, so it can be shown in the pop-up dialog.",
    color: "#f0000"
  };
  events.push(newEvent);

/*
  onGetTask((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      
      var newEvento = {
        id: doc.id,
        from: task.inicioFecha.toDate(),
        to: task.finFecha.toDate(),
        title: "Evento ",
        description:
          "This is a description of the event that has been added, so it can be shown in the pop-up dialog.",
        color: "#f0000"
      };

      events.push(newEvento);
    });
  });

  return events;
}
calendarInstance.addEvents(getEvents());*/