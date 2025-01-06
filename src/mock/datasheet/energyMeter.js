[
  {
    typeId: 1,
    type: "Energy Meter",
    manufacturer: "Generic",
    model: "EM-101",
    protocol: "Modbus",
    description: "3-Phase Energy Meter with Power Quality Monitoring",
    fields: [
  {
      index: 0,
      label: "Watts Total",
      unit: "W",
      type: "number",
      category: "power",
      description: "Total active power consumption",
      address: "40101"
    },
    {
      index: 1,
      label: "Watts R phase",
      unit: "W",
      type: "number",
      category: "power",
      description: "R phase active power",
      address: "40103"
    },
    {
      index: 2,
      label: "Watts Y phase",
      unit: "W",
      type: "number",
      category: "power",
      description: "Y phase active power",
      address: "40105"
    },
    {
      index: 3,
      label: "Watts B phase",
      unit: "W",
      type: "number",
      category: "power",
      description: "B phase active power",
      address: "40107"
    },
    // Reactive Power
    {
      index: 4,
      label: "VAR Total",
      unit: "VAR",
      type: "number",
      category: "reactive_power",
      description: "Total reactive power",
      address: "40109"
    },
    {
      index: 5,
      label: "VAR R phase",
      unit: "VAR",
      type: "number",
      category: "reactive_power",
      description: "R phase reactive power",
      address: "40111"
    },
    {
      index: 6,
      label: "VAR Y phase",
      unit: "VAR",
      type: "number",
      category: "reactive_power",
      description: "Y phase reactive power",
      address: "40113"
    },
    {
      index: 7,
      label: "VAR B phase",
      unit: "VAR",
      type: "number",
      category: "reactive_power",
      description: "B phase reactive power",
      address: "40115"
    },
    // Power Factor
    {
      index: 8,
      label: "PF Total",
      unit: "",
      type: "number",
      category: "power_factor",
      description: "Total power factor",
      address: "40117"
    },
    {
      index: 9,
      label: "PF R phase",
      unit: "",
      type: "number",
      category: "power_factor",
      description: "R phase power factor",
      address: "40119"
    },
    {
      index: 10,
      label: "PF Y phase",
      unit: "",
      type: "number",
      category: "power_factor",
      description: "Y phase power factor",
      address: "40121"
    },
    {
      index: 11,
      label: "PF B phase",
      unit: "",
      type: "number",
      category: "power_factor",
      description: "B phase power factor",
      address: "40123"
    },
    // Apparent Power
    {
      index: 12,
      label: "VA Total",
      unit: "VA",
      type: "number",
      category: "apparent_power",
      description: "Total apparent power",
      address: "40125"
    },
    {
      index: 13,
      label: "VA R phase",
      unit: "VA",
      type: "number",
      category: "apparent_power",
      description: "R phase apparent power",
      address: "40127"
    },
    {
      index: 14,
      label: "VA Y phase",
      unit: "VA",
      type: "number",
      category: "apparent_power",
      description: "Y phase apparent power",
      address: "40129"
    },
    {
      index: 15,
      label: "VA B phase",
      unit: "VA",
      type: "number",
      category: "apparent_power",
      description: "B phase apparent power",
      address: "40131"
    },
    // Voltage Line-to-Line
    {
      index: 16,
      label: "VLL Average",
      unit: "V",
      type: "number",
      category: "voltage",
      description: "Average line-to-line voltage",
      address: "40133"
    },
    {
      index: 17,
      label: "Vry phase",
      unit: "V",
      type: "number",
      category: "voltage",
      description: "R-Y phase voltage",
      address: "40135"
    },
    {
      index: 18,
      label: "Vyb phase",
      unit: "V",
      type: "number",
      category: "voltage",
      description: "Y-B phase voltage",
      address: "40137"
    },
    {
      index: 19,
      label: "Vbr phase",
      unit: "V",
      type: "number",
      category: "voltage",
      description: "B-R phase voltage",
      address: "40139"
    },
    // Voltage Line-to-Neutral
    {
      index: 20,
      label: "VLN Average",
      unit: "V",
      type: "number",
      category: "voltage",
      description: "Average line-to-neutral voltage",
      address: "40141"
    },
    {
      index: 21,
      label: "V R Phase",
      unit: "V",
      type: "number",
      category: "voltage",
      description: "R phase voltage",
      address: "40143"
    },
    {
      index: 22,
      label: "V Y Phase",
      unit: "V",
      type: "number",
      category: "voltage",
      description: "Y phase voltage",
      address: "40145"
    },
    {
      index: 23,
      label: "V B Phase",
      unit: "V",
      type: "number",
      category: "voltage",
      description: "B phase voltage",
      address: "40147"
    },
    // Current
    {
      index: 24,
      label: "Current Total",
      unit: "A",
      type: "number",
      category: "current",
      description: "Total current",
      address: "40149"
    },
    {
      index: 25,
      label: "Current R phase",
      unit: "A",
      type: "number",
      category: "current",
      description: "R phase current",
      address: "40151"
    },
    {
      index: 26,
      label: "Current Y phase",
      unit: "A",
      type: "number",
      category: "current",
      description: "Y phase current",
      address: "40153"
    },
    {
      index: 27,
      label: "Current B phase",
      unit: "A",
      type: "number",
      category: "current",
      description: "B phase current",
      address: "40155"
    },
    // Frequency
    {
      index: 28,
      label: "Frequency",
      unit: "Hz",
      type: "number",
      category: "frequency",
      description: "System frequency",
      address: "40157"
    },
    // Energy Measurements
    {
      index: 29,
      label: "Wh received",
      unit: "Wh",
      type: "number",
      category: "energy",
      description: "Active energy received",
      cumulative: true,
      address: "40159"
    },

        {
      index: 30,
      label: "VAh received",
      unit: "VAh",
      type: "number",
      category: "energy",
      description: "Apparent energy received",
      cumulative: true,
      address: "40161"
    },
    {
      index: 31,
      label: "VARh Ind. Received",
      unit: "VARh",
      type: "number",
      category: "energy",
      description: "Inductive reactive energy received",
      cumulative: true,
      address: "40163"
    },
    {
      index: 32,
      label: "VARh Cap. Received",
      unit: "VARh",
      type: "number",
      category: "energy",
      description: "Capacitive reactive energy received",
      cumulative: true,
      address: "40165"
    },
    {
      index: 33,
      label: "Wh Delivered",
      unit: "Wh",
      type: "number",
      category: "energy",
      description: "Active energy delivered",
      cumulative: true,
      address: "40167"
    },
    {
      index: 34,
      label: "VAh Delivered",
      unit: "VAh",
      type: "number",
      category: "energy",
      description: "Apparent energy delivered",
      cumulative: true,
      address: "40169"
    },
    {
      index: 35,
      label: "VARh Ind. Delivered",
      unit: "VARh",
      type: "number",
      category: "energy",
      description: "Inductive reactive energy delivered",
      cumulative: true,
      address: "40171"
    },
    {
      index: 36,
      label: "VARh Cap. Delivered",
      unit: "VARh",
      type: "number",
      category: "energy",
      description: "Capacitive reactive energy delivered",
      cumulative: true,
      address: "40173"
    },

    // Power Quality Measurements
    {
      index: 37,
      label: "Voltage R Harmonics",
      unit: "",
      type: "number",
      category: "power_quality",
      description: "R phase voltage harmonics",
      address: "40185"
    },
    {
      index: 38,
      label: "Voltage Y Harmonics",
      unit: "",
      type: "number",
      category: "power_quality",
      description: "Y phase voltage harmonics",
      address: "40187"
    },
    {
      index: 39,
      label: "Voltage B Harmonics",
      unit: "",
      type: "number",
      category: "power_quality",
      description: "B phase voltage harmonics",
      address: "40189"
    },
    {
      index: 40,
      label: "Current R Harmonics",
      unit: "",
      type: "number",
      category: "power_quality",
      description: "R phase current harmonics",
      address: "40191"
    },
    {
      index: 41,
      label: "Current Y Harmonics",
      unit: "",
      type: "number",
      category: "power_quality",
      description: "Y phase current harmonics",
      address: "40193"
    },
    {
      index: 42,
      label: "Current B Harmonics",
      unit: "",
      type: "number",
      category: "power_quality",
      description: "B phase current harmonics",
      address: "40195"
    },

    // Demand Measurements
    {
      index: 43,
      label: "kW demand",
      unit: "kW",
      type: "number",
      category: "demand",
      description: "Active power demand",
      address: "40197"
    },
    {
      index: 44,
      label: "kVA demand",
      unit: "kVA",
      type: "number",
      category: "demand",
      description: "Apparent power demand",
      address: "40199"
    },
    {
      index: 45,
      label: "kVAR demand",
      unit: "kVAR",
      type: "number",
      category: "demand",
      description: "Reactive power demand",
      address: "40201"
    },
    {
      index: 46,
      label: "kW Maximum demand",
      unit: "kW",
      type: "number",
      category: "demand",
      description: "Maximum active power demand",
      address: "40209"
    },
    {
      index: 47,
      label: "kVA maximum demand",
      unit: "kVA",
      type: "number",
      category: "demand",
      description: "Maximum apparent power demand",
      address: "40211"
    },
    {
      index: 48,
      label: "kVAR maximum demand",
      unit: "kVAR",
      type: "number",
      category: "demand",
      description: "Maximum reactive power demand",
      address: "40213"
    },

    // Operating Parameters
    {
      index: 49,
      label: "RPM",
      unit: "rpm",
      type: "number",
      category: "operation",
      description: "Revolutions per minute",
      address: "40215"
    },
    {
      index: 50,
      label: "Load Hours Received",
      unit: "h",
      type: "number",
      category: "operation",
      description: "Load hours in receiving mode",
      address: "40217"
    },
    {
      index: 51,
      label: "Load Hours Delivered",
      unit: "h",
      type: "number",
      category: "operation",
      description: "Load hours in delivery mode",
      address: "40219"
    },
    {
      index: 52,
      label: "No of interruptions",
      unit: "",
      type: "number",
      category: "operation",
      description: "Number of power interruptions",
      address: "40221"
    },

    // Phase-wise Energy Measurements
    {
      index: 53,
      label: "kWh received - R Phase",
      unit: "kWh",
      type: "number",
      category: "energy",
      description: "Active energy received on R phase",
      address: "40243"
    },
    {
      index: 54,
      label: "kWh received - Y Phase",
      unit: "kWh",
      type: "number",
      category: "energy",
      description: "Active energy received on Y phase",
      address: "40245"
    },
    {
      index: 55,
      label: "kWh received - B Phase",
      unit: "kWh",
      type: "number",
      category: "energy",
      description: "Active energy received on B phase",
      address: "40247"
    },

    // Power Quality Parameters
    {
      index: 56,
      label: "Voltage VR_Unbalance",
      unit: "%",
      type: "number",
      category: "power_quality",
      description: "Voltage unbalance R phase",
      address: "40327"
    },
    {
      index: 57,
      label: "Voltage VY_Unbalance",
      unit: "%",
      type: "number",
      category: "power_quality",
      description: "Voltage unbalance Y phase",
      address: "40329"
    },
    {
      index: 58,
      label: "Voltage VB_Unbalance",
      unit: "%",
      type: "number",
      category: "power_quality",
      description: "Voltage unbalance B phase",
      address: "40331"
    },
    {
      index: 59,
      label: "Current AR_Unbalance",
      unit: "%",
      type: "number",
      category: "power_quality",
      description: "Current unbalance R phase",
      address: "40333"
    },
    {
      index: 60,
      label: "Current AY_Unbalance",
      unit: "%",
      type: "number",
      category: "power_quality",
      description: "Current unbalance Y phase",
      address: "40335"
    },
    {
      index: 61,
      label: "Current AB_Unbalance",
      unit: "%",
      type: "number",
      category: "power_quality",
      description: "Current unbalance B phase",
      address: "40337"
    },

    // Phase Angles
    {
      index: 62,
      label: "Voltage R phase angle",
      unit: "deg",
      type: "number",
      category: "phase_angle",
      description: "Voltage phase angle R phase",
      address: "40339"
    },
    {
      index: 63,
      label: "Voltage Y phase angle",
      unit: "deg",
      type: "number",
      category: "phase_angle",
      description: "Voltage phase angle Y phase",
      address: "40341"
    },
    {
      index: 64,
      label: "Voltage B phase angle",
      unit: "deg",
      type: "number",
      category: "phase_angle",
      description: "Voltage phase angle B phase",
      address: "40343"
    },
    {
      index: 65,
      label: "Current R phase angle",
      unit: "deg",
      type: "number",
      category: "phase_angle",
      description: "Current phase angle R phase",
      address: "40345"
    },
    {
      index: 66,
      label: "Current Y phase angle",
      unit: "deg",
      type: "number",
      category: "phase_angle",
      description: "Current phase angle Y phase",
      address: "40347"
    },
    {
      index: 67,
      label: "Current B phase angle",
      unit: "deg",
      type: "number",
      category: "phase_angle",
      description: "Current phase angle B phase",
      address: "40349"
    },

    // Environmental
    {
      index: 68,
      label: "CO2",
      unit: "",
      type: "number",
      category: "environmental",
      description: "CO2 emissions measurement",
      address: "40351"
    },

        // Phase-wise kVAh Received
    {
      index: 69,
      label: "kVAh received - R Phase",
      unit: "kVAh",
      type: "number",
      category: "energy",
      description: "Apparent energy received on R phase",
      address: "40249"
    },
    {
      index: 70,
      label: "kVAh received - Y phase",
      unit: "kVAh",
      type: "number",
      category: "energy",
      description: "Apparent energy received on Y phase",
      address: "40251"
    },
    {
      index: 71,
      label: "kVAh received - B phase",
      unit: "kVAh",
      type: "number",
      category: "energy",
      description: "Apparent energy received on B phase",
      address: "40253"
    },

    // Phase-wise Inductive kVARh Received
    {
      index: 72,
      label: "kVARh inductive received - R",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Inductive reactive energy received on R phase",
      address: "40255"
    },
    {
      index: 73,
      label: "kVARh inductive received - Y",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Inductive reactive energy received on Y phase",
      address: "40257"
    },
    {
      index: 74,
      label: "kVARh inductive received - B",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Inductive reactive energy received on B phase",
      address: "40259"
    },

    // Phase-wise Capacitive kVARh Received
    {
      index: 75,
      label: "kVARh capacitive received - R",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Capacitive reactive energy received on R phase",
      address: "40261"
    },
    {
      index: 76,
      label: "kVARh capacitive received - Y",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Capacitive reactive energy received on Y phase",
      address: "40263"
    },
    {
      index: 77,
      label: "kVARh capacitive received - B",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Capacitive reactive energy received on B phase",
      address: "40265"
    },

    // Phase-wise kWh Delivered
    {
      index: 78,
      label: "kWh Delivered - R Phase",
      unit: "kWh",
      type: "number",
      category: "energy",
      description: "Active energy delivered on R phase",
      address: "40279"
    },
    {
      index: 79,
      label: "kWh Delivered - Y Phase",
      unit: "kWh",
      type: "number",
      category: "energy",
      description: "Active energy delivered on Y phase",
      address: "40281"
    },
    {
      index: 80,
      label: "kWh Delivered - B Phase",
      unit: "kWh",
      type: "number",
      category: "energy",
      description: "Active energy delivered on B phase",
      address: "40283"
    },

    // Phase-wise kVAh Delivered
    {
      index: 81,
      label: "kVAh Delivered - R phases",
      unit: "kVAh",
      type: "number",
      category: "energy",
      description: "Apparent energy delivered on R phase",
      address: "40285"
    },
    {
      index: 82,
      label: "kVAh Delivered - Y phases",
      unit: "kVAh",
      type: "number",
      category: "energy",
      description: "Apparent energy delivered on Y phase",
      address: "40287"
    },
    {
      index: 83,
      label: "kVAh Delivered - B phases",
      unit: "kVAh",
      type: "number",
      category: "energy",
      description: "Apparent energy delivered on B phase",
      address: "40289"
    },

    // Phase-wise Inductive kVARh Delivered
    {
      index: 84,
      label: "kVARh inductive Delivered - R",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Inductive reactive energy delivered on R phase",
      address: "40291"
    },
    {
      index: 85,
      label: "kVARh inductive Delivered - Y",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Inductive reactive energy delivered on Y phase",
      address: "40293"
    },
    {
      index: 86,
      label: "kVARh inductive Delivered - B",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Inductive reactive energy delivered on B phase",
      address: "40295"
    },

    // Phase-wise Capacitive kVARh Delivered
    {
      index: 87,
      label: "kVARh capacitive Delivered - R",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Capacitive reactive energy delivered on R phase",
      address: "40297"
    },
    {
      index: 88,
      label: "kVARh capacitive Delivered - Y",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Capacitive reactive energy delivered on Y phase",
      address: "40299"
    },
    {
      index: 89,
      label: "kVARh capacitive Delivered - B",
      unit: "kVARh",
      type: "number",
      category: "energy",
      description: "Capacitive reactive energy delivered on B phase",
      address: "40301"
    },

    // Load Hours by Phase
    {
      index: 90,
      label: "Load hours received - R phases",
      unit: "h",
      type: "number",
      category: "operation",
      description: "Load hours received on R phase",
      address: "40315"
    },
    {
      index: 91,
      label: "Load hours received - Y phases",
      unit: "h",
      type: "number",
      category: "operation",
      description: "Load hours received on Y phase",
      address: "40317"
    },
    {
      index: 92,
      label: "Load hours received - B phases",
      unit: "h",
      type: "number",
      category: "operation",
      description: "Load hours received on B phase",
      address: "40319"
    },
    {
      index: 93,
      label: "Load hours Delivered - R phases",
      unit: "h",
      type: "number",
      category: "operation",
      description: "Load hours delivered on R phase",
      address: "40321"
    },
    {
      index: 94,
      label: "Load hours Delivered - Y phases",
      unit: "h",
      type: "number",
      category: "operation",
      description: "Load hours delivered on Y phase",
      address: "40323"
    },
    {
      index: 95,
      label: "Load hours Delivered - B phases",
      unit: "h",
      type: "number",
      category: "operation",
      description: "Load hours delivered on B phase",
      address: "40325"
    },  {
      index: 96,
      label: "PF average Received - All 3",
      unit: "",
      type: "number",
      category: "power_factor",
      description: "Average power factor for all 3 phases in receive mode",
      address: ["40267", "40269", "40271"] // Multiple addresses as shown in green highlight
    },
    {
      index: 97,
      label: "PF average Delivered - All 3",
      unit: "",
      type: "number",
      category: "power_factor",
      description: "Average power factor for all 3 phases in deliver mode",
      address: ["40303", "40305", "40307"] // Multiple addresses as shown in green highlight
    },

    // Special Current Averages
    {
      index: 98,
      label: "A average Received - All 3 phases",
      unit: "A",
      type: "number",
      category: "current",
      description: "Average current for all 3 phases in receive mode",
      address: ["40273", "40275", "40277"] // Multiple addresses as shown in green highlight
    },
    {
      index: 99,
      label: "A average Delivered - All 3 phases",
      unit: "A",
      type: "number",
      category: "current",
      description: "Average current for all 3 phases in deliver mode",
      address: ["40309", "40311", "40313"] // Multiple addresses as shown in green highlight
    },

    // On Hours
    {
      index: 100,
      label: "On_hours",
      unit: "h",
      type: "number",
      category: "operation",
      description: "Total hours the device has been powered on",
      address: "40229"
    }
      
      
    ],
  },
]
