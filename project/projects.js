

const projects = {

  // ---------------------------------------------------------------------
  //! 1. Buck Converter
  // ---------------------------------------------------------------------
  "buck-converter": {
    id: "buck-converter",
    title: "DC-DC Buck Converter",
    shortDescription:
      "A step-down switching regulator PCB that converts a higher DC input voltage to a stable, lower regulated output.",
    fullDescription:
      "This board implements a synchronous/non-synchronous buck converter for stepping down a DC input to a regulated lower voltage rail. The layout follows standard switching-regulator practice — a compact power stage (inductor, switching MOSFET/diode, and output capacitors) placed close together to minimize loop area and switching noise.\n\nThe schematic and PCB layout were designed and routed as a two-layer board, with the 3D render used to check component placement and clearance before ordering.",
    completionDate: "2026", // TODO: replace with the exact month/year you finished this
    technologies: ["PCB Design", "Switching Regulators", "KiCad"], // TODO: confirm/adjust
    components: [
      { name: "Inductor", qty: "1", note: "Main energy-storage element" }, // TODO: add exact value/part number
      { name: "Switching MOSFET", qty: "1", note: "Main switching element" }, // TODO: part number
      { name: "Output Capacitors", qty: "—", note: "Output ripple filtering" }, // TODO: values
      { name: "Feedback/Control IC", qty: "1", note: "Regulates output voltage" } // TODO: exact IC used
    ],
    features: [
      "Regulated DC output from a higher input voltage",
      "Compact two-layer PCB layout",
      "Designed and verified in schematic + 3D before fabrication"
    ], // TODO: replace with your actual measured specs (input/output V, max current, efficiency)
    githubLink: "https://github.com/alisolangi1122345-cpu/LM2575-Buck-Converter.git", // TODO: add your repo URL, or set to "" to hide the button
    circuitDiagram: "/project/assets/Buck converter/Schematic.jpeg",
    images: [
      "/project/assets/Buck converter/3D image.jpeg",
      "/project/assets/Buck converter/PCB-LAyout.png",
    ],
    video: ""
  },

  // ---------------------------------------------------------------------
  //! 2. Dual Output Power Supply
  // ---------------------------------------------------------------------
  "dual-output-supply": {
    id: "dual-output-supply",
    title: "Dual Output Power Supply",
    shortDescription:
      "A linear power supply PCB providing two independent regulated output rails from a single AC/DC input stage.",
    fullDescription:
      "This board is a dual-rail regulated supply, useful for powering op-amp circuits or any project that needs both a positive and negative (or two independent positive) rails from one source.\n\nThe design was laid out and routed as a PCB, with dedicated regulation and filtering per output so each rail stays clean independent of load on the other.",
    completionDate: "2026", // TODO: replace with exact date
    technologies: ["PCB Design", "Linear Regulation", "KiCad"], // TODO: confirm
    components: [
      { name: "Voltage Regulator (Rail 1)", qty: "1", note: "First output regulation" }, // TODO: part number
      { name: "Voltage Regulator (Rail 2)", qty: "1", note: "Second output regulation" }, // TODO: part number
      { name: "Filter Capacitors", qty: "—", note: "Input/output smoothing" }, // TODO: values
      { name: "Rectifier / Bridge", qty: "1", note: "If AC input is used" } // TODO: confirm/remove
    ],
    features: [
      "Two independently regulated output rails",
      "Filtered, low-ripple outputs",
      "Compact single PCB for both supplies"
    ], // TODO: replace with your actual output voltages/currents
    githubLink: "https://github.com/alisolangi1122345-cpu/Dual-Output-AC-to-DC-Power-Supply.git", // TODO: add your repo URL
    circuitDiagram: "/project/assets/Daul-output-supply/Schematic.png",
    images: [
      "/project/assets/Daul-output-supply/3D.png",
      "/project/assets/Daul-output-supply/PCB layout.png",
    ],
    video: ""
  },

  // ---------------------------------------------------------------------
  //! 3. Digital Bench Power Supply
  // ---------------------------------------------------------------------
  "digital-bench-power-supply": {
    id: "digital-bench-power-supply",
    title: "Digital Bench Power Supply",
    shortDescription:
      "A microcontroller-monitored bench supply with a digital display for live voltage/current readout instead of analog meters.",
    fullDescription:
      "This project is a bench power supply built around a regulated analog power stage, with a microcontroller reading back voltage and current and showing the values on a digital display in real time — replacing bulky analog panel meters.\n\nThe PCB was designed with the power stage and the sensing/display circuitry laid out together, and the 3D render was used to verify the enclosure fit before building the physical unit.",
    completionDate: "2026", // TODO: replace with exact date
    technologies: ["Analog Design", "Embedded C", "ADC Sampling", "PCB Design"], // TODO: confirm
    components: [
      { name: "Power Regulation Stage", qty: "1", note: "Main voltage regulation" }, // TODO: exact regulator/topology
      { name: "Microcontroller", qty: "1", note: "Reads sensors, drives display" }, // TODO: exact MCU
      { name: "Digital Display", qty: "1", note: "Live voltage/current readout" }, // TODO: display type (OLED/LCD/7-seg)
      { name: "Current Sense Resistor/IC", qty: "1", note: "Feeds ADC for current readout" } // TODO: confirm
    ],
    features: [
      "Live digital voltage and current readout",
      "Adjustable regulated output",
      "Custom PCB combining power stage and monitoring electronics"
    ], // TODO: replace with your actual voltage/current range
    githubLink: "https://github.com/alisolangi1122345-cpu/Digital-Bench-Power-Supply.git", // TODO: add your repo URL
    circuitDiagram: "/project/assets/Digital bench press suplly/Schematic.png",
    images: [
      "/project/assets/Digital bench press suplly/3D.png",
      "/project/assets/Digital bench press suplly/Pcb layout.png"
    ],
    video: ""
  },

  // ---------------------------------------------------------------------
  //!  4. ESP32 Bluetooth Car
  // ---------------------------------------------------------------------
  "esp32-bluetooth-car": {
    id: "esp32-bluetooth-car",
    title: "ESP32 Bluetooth-Controlled Car",
    shortDescription:
      "A wireless robot car driven by an ESP32, controlled over Bluetooth from a phone, with a motor driver stage for the drive motors.",
    fullDescription:
      "This build is a small wheeled robot controlled wirelessly over Bluetooth using an ESP32's built-in radio. Motion commands are sent from a phone app and translated by the ESP32 into PWM signals for a motor driver stage, which drives the car's DC motors forward, backward, and through turns.\n\nThe finished chassis carries the ESP32, motor driver, motors, and battery pack, and was tested and driven as shown in the demo video.",
    completionDate: "2026", // TODO: replace with exact date
    technologies: ["ESP32", "Bluetooth (BLE/Classic)", "Embedded C", "PWM Motor Control"], // TODO: confirm which Bluetooth stack used
    components: [
      { name: "ESP32 Dev Board", qty: "1", note: "Main controller + Bluetooth" },
      { name: "Motor Driver (e.g. L298N/TB6612)", qty: "1", note: "Drives the DC motors" }, // TODO: confirm exact driver IC
      { name: "DC Gear Motors", qty: "2", note: "Drive wheels" }, // TODO: confirm quantity/specs
      { name: "Battery Pack", qty: "1", note: "Powers motors + electronics" },
      { name: "Chassis + Wheels", qty: "1", note: "Robot car body" }
    ],
    features: [
      "Wireless Bluetooth control from a phone",
      "Forward / reverse / turning motion control",
      "Onboard battery power, fully untethered driving",
      "Demonstrated working in the video below"
    ],
    githubLink: "https://github.com/alisolangi1122345-cpu/ESP32-Bluetooth-RC-Car.git", // TODO: add your repo URL
    circuitDiagram: "/project/assets/ESP32 Bluetooth car/Diagram.png",

    images: [
      "/project/assets/ESP32 Bluetooth car/Images-final-build.jpg"
    ],

    video: "/project/assets/ESP32 Bluetooth car/Video.mp4"
  },

  // ---------------------------------------------------------------------
  //! 5. Home Automation System
  // ---------------------------------------------------------------------
  "home-automation-system": {
    id: "home-automation-system",
    title: "Home Automation System",
    shortDescription:
      "A microcontroller-based system for controlling home appliances remotely, switching relays to turn devices on and off.",
    fullDescription:
      "This project lets household appliances be switched on and off through a microcontroller-driven relay stage, rather than manual switches. It's built around a wireless-capable microcontroller so devices can be toggled remotely, with the relay module providing safe isolation between the low-voltage control electronics and the mains-powered appliances.\n\nThe working demo video shows the system switching connected loads in response to commands.",
    completionDate: "2026", // TODO: replace with exact date
    technologies: ["Embedded C", "Wi-Fi / IoT", "Relay Control"], // TODO: confirm exact wireless method (Wi-Fi/Bluetooth/app used)
    components: [
      { name: "Microcontroller (Wi-Fi capable)", qty: "1", note: "Main controller" }, // TODO: confirm exact board (ESP8266/ESP32/etc.)
      { name: "Relay Module", qty: "1", note: "Switches mains-powered appliances" }, // TODO: confirm channel count
      { name: "Power Supply Module", qty: "1", note: "Powers the control electronics" }
    ],
    features: [
      "Remote on/off control of connected appliances",
      "Relay-isolated switching for safety",
      "Demonstrated working in the video below"
    ], // TODO: add details like app used, number of channels, voice control if applicable
    githubLink: "https://github.com/alisolangi1122345-cpu/ESP32-Home-Automation-System.git", // TODO: add your repo URL
    circuitDiagram: "",
    images: [
      "/project/assets/Home-Automation Sytstem/Image.png"
    ],
    video: "/project/assets/Home-Automation Sytstem/video.mp4"
  },

  // ---------------------------------------------------------------------
  //! 6. LED Chaser
  // ---------------------------------------------------------------------
  "led-chaser": {
    id: "led-chaser",
    title: "LED Chaser Circuit",
    shortDescription:
      "A sequential LED chaser board that lights up a row of LEDs one after another to create a moving-light effect.",
    fullDescription:
      "This project drives a row of LEDs in sequence to produce a classic 'chaser' or 'Knight Rider' style scanning light effect. The circuit was laid out on a dedicated PCB, with the schematic and 3D render used to plan LED spacing and current-limiting resistor placement before fabrication.",
    completionDate: "2026", // TODO: replace with exact date
    technologies: ["Digital Logic", "PCB Design"], // TODO: confirm — e.g. 555 timer + counter IC, or microcontroller-driven
    components: [
      { name: "Sequencing IC / Microcontroller", qty: "1", note: "Drives LED sequence" }, // TODO: confirm exact IC (e.g. CD4017, 555 timer, or MCU)
      { name: "LEDs", qty: "—", note: "Chaser output" }, // TODO: exact count
      { name: "Current-Limiting Resistors", qty: "—", note: "One per LED" }
    ],
    features: [
      "Sequential scanning LED light effect",
      "Custom-designed PCB",
      "Adjustable chase speed" // TODO: confirm if speed is actually adjustable, or remove
    ],
    githubLink: "A custom-designed LED Chaser Circuit featuring smooth sequential lighting effects. Built to demonstrate digital timing, LED control, and practical PCB design through simulation and hardware implementation.", // TODO: add your repo URL
    circuitDiagram: "/project/assets/Led Chaser/Schematic.png",
    images: [
      "/project/assets/Led Chaser/3D.png",
      "/project/assets/Led Chaser/PCB layout.png",
      "/project/assets/Led Chaser/Schematic.png"
    ],
    video: "/project/assets/Led Chaser/Demo.mp4"
  },

  // ---------------------------------------------------------------------
  //! 7. RFID Attendance System
  // ---------------------------------------------------------------------
  "rfid-attendance-system": {
    id: "rfid-attendance-system",
    title: "RFID Attendance System",
    shortDescription:
      "An RFID-based system that logs attendance automatically when a card or tag is scanned, removing the need for manual sign-in sheets.",
    fullDescription:
      "This project uses an RFID reader to identify individual cards/tags and record attendance automatically the moment a card is scanned. The microcontroller reads the card's unique ID, checks it, and logs the event — shown working in the demo video below.",
    completionDate: "2025", // TODO: replace with exact date
    technologies: ["Embedded C", "SPI", "RFID (RC522 or similar)"], // TODO: confirm exact RFID module used
    components: [
      { name: "Microcontroller", qty: "1", note: "Reads RFID data, logs attendance" }, // TODO: confirm exact board
      { name: "RFID Reader Module", qty: "1", note: "Scans card/tag UID" }, // TODO: confirm exact module (e.g. RC522)
      { name: "Display / Indicator", qty: "1", note: "Shows scan status" } // TODO: confirm if an LCD/OLED/LED is used
    ],
    features: [
      "Automatic attendance logging on card scan",
      "Fast, contactless identification",
      "Demonstrated working in the video below"
    ], // TODO: add details on where/how attendance is stored (SD card, server, app, etc.)
    githubLink: "https://github.com/alisolangi1122345-cpu/RFID-Attendance-System.git", // TODO: add your repo URL
    circuitDiagram: "/project/assets/RFID attendence  system/Image.png",
    images: [
      "/project/assets/RFID attendence  system/Image.png"
    ],
    video: "/project/assets/RFID attendence  system/Video.mp4"
  },

  // ---------------------------------------------------------------------
  //! 8. Smoke + Fire Detection System
  // ---------------------------------------------------------------------
  "smoke-fire-detection": {
    id: "smoke-fire-detection",
    title: "Smoke & Fire Detection System",
    shortDescription:
      "A safety system that detects smoke and flame conditions and triggers an alert, simulated and tested in Proteus before the physical build.",
    fullDescription:
      "This project detects smoke and/or flame using dedicated sensors and triggers an alarm/alert when unsafe conditions are found. Before building the physical circuit, the design was simulated in Proteus to validate the sensing and alarm logic, and the same behavior was then confirmed on real hardware.\n\nBoth the Proteus simulation run and the physical hardware demo are included in your assets folder.",
    completionDate: "2026", // TODO: replace with exact date
    technologies: ["Embedded C", "Sensor Interfacing", "Proteus Simulation"], // TODO: confirm exact sensors used
    components: [
      { name: "Smoke Sensor (e.g. MQ-2)", qty: "1", note: "Detects smoke/gas presence" }, // TODO: confirm exact sensor
      { name: "Flame Sensor", qty: "1", note: "Detects flame/IR signature" }, // TODO: confirm if used
      { name: "Microcontroller", qty: "1", note: "Reads sensors, triggers alarm" }, // TODO: confirm exact board
      { name: "Buzzer / Alarm Output", qty: "1", note: "Audible alert on detection" }
    ],
    features: [
      "Detects smoke and/or flame conditions",
      "Audible alarm on detection",
      "Validated first in Proteus simulation, then on real hardware"
    ],
    githubLink: "#", // TODO: add your repo URL
    circuitDiagram: "/project/assets/Smoke + fire system/Image.png",
    images: [
      "/project/assets/Smoke + fire system/Image.png"
    ],

    // video: "/project/assets/Smoke + fire system/Proteus simulation.mp4",
    video: "/project/assets/Smoke + fire system/Video.mp4"
  },

  // ---------------------------------------------------------------------
  //! 9. STM32 Project
  // ---------------------------------------------------------------------
  "stm32": {
    id: "stm32",
    title: "STM32-Based Project",
    shortDescription:
      "A custom PCB built around an STM32 microcontroller, designed and verified through schematic capture, PCB layout, and a 3D render.",
    fullDescription:
      "This board is built around an STM32 microcontroller as its main processing element. The full design flow — schematic capture, PCB routing, and a 3D render for mechanical/enclosure checks — was completed before fabrication.\n\nNOTE: Please replace this description with what the board actually does (e.g. motor control, data acquisition, a specific interface project) — the uploaded files show the schematic/PCB/3D render but not the firmware or end application.",
    completionDate: "2026",
    technologies: ["STM32", "Embedded C", "PCB Design"], 
    components: [
      { name: "STM32 Microcontroller", qty: "1", note: "Main processor" }, // TODO: confirm exact part (e.g. STM32F103C8T6)
      { name: "Supporting Passives", qty: "—", note: "Decoupling, pull-ups, etc." },
      { name: "Connectors/Headers", qty: "—", note: "Programming and I/O access" }
    ],
    features: [
      "Custom STM32-based PCB",
      "Full design flow: schematic → PCB → 3D render → fabrication"
    ],
    githubLink: "https://github.com/alisolangi1122345-cpu/STM32-Development-Board-PCB.git", // TODO: add your repo URL  
    circuitDiagram: "/project/assets/STM32/schematic.png",
    images: [

      "/project/assets/STM32/3D.png",
      "/project/assets/STM32/PCB layout.png",
    ],
    video: ""
  },



  // ---------------------------------------------------------------------
  //! 10. Water Tank Monitoring System
  // ---------------------------------------------------------------------  
  
  "water-tank-monitoring-system": {
  id: "water-tank-level-controller",
  title: "Automatic Water Tank Level Controller",
  shortDescription:
    "An Arduino-based automatic water tank controller that monitors water level using an ultrasonic sensor and automatically switches the water pump ON/OFF.",

  fullDescription:
    "This project is an automatic water tank level controller developed using Arduino Uno. The system continuously measures the water level with an HC-SR04 ultrasonic sensor and automatically controls a water pump through a relay module.\n\nA 16×2 LCD provides real-time information about the tank level and pump status, allowing users to monitor the system easily. The controller helps prevent water overflow, protects the pump from dry running, and eliminates the need for manual pump operation. The project was first validated through simulation and then implemented successfully on real hardware.",

  completionDate: "2026",

  technologies: [
    "Arduino Uno",
    "Embedded C",
    "Ultrasonic Sensor",
    "Relay Control"
  ],

  components: [
    {
      name: "Arduino Uno",
      qty: "1",
      note: "Main microcontroller"
    },
    {
      name: "HC-SR04 Ultrasonic Sensor",
      qty: "1",
      note: "Measures water level"
    },
    {
      name: "1-Channel Relay Module",
      qty: "1",
      note: "Controls the water pump"
    },
    {
      name: "16×2 LCD Display",
      qty: "1",
      note: "Displays water level and pump status"
    },
    {
      name: "12V DC Water Pump",
      qty: "1",
      note: "Fills the water tank automatically"
    },
    {
      name: "Power Supply",
      qty: "1",
      note: "Powers the system"
    }
  ],

  features: [
    "Automatic pump ON/OFF control",
    "Real-time water level monitoring",
    "LCD status display",
    "Prevents tank overflow",
    "Protects pump from dry running",
    "Fully tested on physical hardware"
  ],

  githubLink:
  "https://github.com/alisolangi1122345-cpu/-Automatic-Water-Tank-Level-Controller.git",

  circuitDiagram:
    "/project/assets/A-W-T-M-system/image.png",

  images: [
    
    "/project/assets/A-W-T-M-system/image.png"
  ],

  video:
    "/project/assets/A-W-T-M-system/Video.mp4"
},

};

// window.PROJECTS = projects;
window.PROJECTS = projects;
console.log("PROJECTS LOADED", window.PROJECTS);