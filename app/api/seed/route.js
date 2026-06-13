import connectDB from "@/lib/db";
import Family from "@/models/families";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  await Family.deleteMany({});  // Family Model এ call করো

  await Family.insertMany([
    {
    "familyId": "50059560",
    "headName": "KAMALA MONDAL",
    "phone": "7890981996",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "KAMALA MONDAL",
        "cardNumber": "50059560"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "50061760",
    "headName": "RUKSANA BIBI",
    "phone": "7439332901",
    "category": "AAY",
    "memberCount": 2,
    "members": [
      {
        "name": "RUKSANA BIBI",
        "cardNumber": "50061760"
      },
      {
        "name": "SK SAMIM",
        "cardNumber": "50061761"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "1216534418",
    "headName": "ANGUR BALA KUTI",
    "phone": "9088143173",
    "category": "AAY",
    "memberCount": 3,
    "members": [
      {
        "name": "SOHINI KUNTI",
        "cardNumber": "1216534418"
      },
      {
        "name": "SRIKANTA KUNTI",
        "cardNumber": "50857792"
      },
      {
        "name": "TUMPA KUNTI",
        "cardNumber": "50857793"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "50857992",
    "headName": "AYESA BIBI",
    "phone": "8910671380",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "AYESA BIBI",
        "cardNumber": "50857992"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "50995808",
    "headName": "ALAM ARA BIBI",
    "phone": "6291283914",
    "category": "AAY",
    "memberCount": 2,
    "members": [
      {
        "name": "ALAM ARA BIBI",
        "cardNumber": "50995808"
      },
      {
        "name": "GAHAR ALI MALLIK",
        "cardNumber": "50995807"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "51759234",
    "headName": "SAKILA BIBI",
    "phone": "8420441150",
    "category": "AAY",
    "memberCount": 2,
    "members": [
      {
        "name": "SAKILA BIBI",
        "cardNumber": "51759234"
      },
      {
        "name": "SK SOHEL",
        "cardNumber": "51759236"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "2014974492",
    "headName": "SAJEDA BIBI",
    "phone": "",
    "category": "AAY",
    "memberCount": 2,
    "members": [
      {
        "name": "MOMTAHINA PARVIN",
        "cardNumber": "2014974492"
      },
      {
        "name": "SK MONIRUL",
        "cardNumber": "51763975"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "541196124",
    "headName": "FARHANA BEGAM",
    "phone": "",
    "category": "AAY",
    "memberCount": 4,
    "members": [
      {
        "name": "ABDUL RAHAMAN MOLLA",
        "cardNumber": "541196124"
      },
      {
        "name": "MD MAHABUBER RAHAMAN MOLLA",
        "cardNumber": "1204898910"
      },
      {
        "name": "MD TAMBIR HASANMOLLA",
        "cardNumber": "2012116788"
      },
      {
        "name": "TANUJA BIBI",
        "cardNumber": "2012116787"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "52606836",
    "headName": "GOLSANARA BIBI",
    "phone": "7439479872",
    "category": "AAY",
    "memberCount": 2,
    "members": [
      {
        "name": "ARJINA KHATUN",
        "cardNumber": "542127977"
      },
      {
        "name": "GOLSANARA BIBI",
        "cardNumber": "52606836"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "52607068",
    "headName": "DURGA MONDAL",
    "phone": "9051928187",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "DURGA MONDAL",
        "cardNumber": "52607068"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "52742824",
    "headName": "LALMAN BIBI",
    "phone": "9330394737",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "SEKH MAIDUL",
        "cardNumber": "52742824"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "53009148",
    "headName": "KETAMON BEWA",
    "phone": "",
    "category": "AAY",
    "memberCount": 2,
    "members": [
      {
        "name": "RAHIMA BIBI",
        "cardNumber": "53009148"
      },
      {
        "name": "SK SAHJAHAN",
        "cardNumber": "53009147"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "53396793",
    "headName": "SADEMAN BIBI",
    "phone": "9874302000",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "SADEMAN BIBI",
        "cardNumber": "53396793"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "53685262",
    "headName": "SK NOOR HOSSAIN",
    "phone": "",
    "category": "AAY",
    "memberCount": 2,
    "members": [
      {
        "name": "NAJIMA BIBI",
        "cardNumber": "53685263"
      },
      {
        "name": "SK NOOR HOSSAIN",
        "cardNumber": "53685262"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "50059910",
    "headName": "BIJALI SINGH",
    "phone": "8647801831",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "BIJALI SINGH",
        "cardNumber": "50059910"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "52332050",
    "headName": "GOLJAN REOYA",
    "phone": "8240292023",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "GOLJAN BEOWA",
        "cardNumber": "52332050"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "52529760",
    "headName": "NILA JHULKI",
    "phone": "8296514009",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "NILA JHULKI",
        "cardNumber": "52529760"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542108976",
    "headName": "RASIDA BEGAM",
    "phone": "8420862101",
    "category": "AAY",
    "memberCount": 4,
    "members": [
      {
        "name": "RASIDA BIBI",
        "cardNumber": "542108976"
      },
      {
        "name": "SK SAHABUDDIN",
        "cardNumber": "542108975"
      },
      {
        "name": "SK SAHIL",
        "cardNumber": "542108977"
      },
      {
        "name": "SK SAJID",
        "cardNumber": "542108979"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129134",
    "headName": "CHANCHALA MATA",
    "phone": "7003620878",
    "category": "AAY",
    "memberCount": 3,
    "members": [
      {
        "name": "CHITTA MATA",
        "cardNumber": "542129134"
      },
      {
        "name": "SRIDAM MATA",
        "cardNumber": "542129132"
      },
      {
        "name": "SRIMONTO MATA",
        "cardNumber": "542129136"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129142",
    "headName": "SAHEBRAN MOLLA",
    "phone": "6289642814",
    "category": "AAY",
    "memberCount": 4,
    "members": [
      {
        "name": "MOJAMMELMOLLA",
        "cardNumber": "542129144"
      },
      {
        "name": "MONIKA BIBI",
        "cardNumber": "542129143"
      },
      {
        "name": "SAHEBRAN MOLLA",
        "cardNumber": "542129142"
      },
      {
        "name": "SOHAN MOLLA",
        "cardNumber": "2017480786"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129291",
    "headName": "SAYARA BIBI",
    "phone": "9836217665",
    "category": "AAY",
    "memberCount": 2,
    "members": [
      {
        "name": "SAHANAJ MOLLA",
        "cardNumber": "542129292"
      },
      {
        "name": "SAYARA BIBI",
        "cardNumber": "542129291"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129295",
    "headName": "SAKINA BIBI",
    "phone": "",
    "category": "AAY",
    "memberCount": 4,
    "members": [
      {
        "name": "SAKINA BIBI",
        "cardNumber": "542129295"
      },
      {
        "name": "SK SAFIUL ALAM",
        "cardNumber": "542129297"
      },
      {
        "name": "SK SAHABUL ALAM",
        "cardNumber": "542129296"
      },
      {
        "name": "SK SAHAJAHAN",
        "cardNumber": "1205738095"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129330",
    "headName": "KARUNA JANA",
    "phone": "7980390310",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "KARUNA JANA",
        "cardNumber": "542129330"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129437",
    "headName": "TAPAN HALDAR",
    "phone": "",
    "category": "AAY",
    "memberCount": 5,
    "members": [
      {
        "name": "LIPIKA HALDAR",
        "cardNumber": "542129440"
      },
      {
        "name": "PRATAP HALDAR",
        "cardNumber": "542129439"
      },
      {
        "name": "PRATIMA HALDAR",
        "cardNumber": "542129438"
      },
      {
        "name": "RUDRA HALDER",
        "cardNumber": "2018999467"
      },
      {
        "name": "TAPAN HALDAR",
        "cardNumber": "542129437"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129514",
    "headName": "SK ANOWAR ALI",
    "phone": "9051706295",
    "category": "AAY",
    "memberCount": 5,
    "members": [
      {
        "name": "AFSHEEN KHATUN",
        "cardNumber": "2017840887"
      },
      {
        "name": "AMIRUDDIN SK",
        "cardNumber": "542129517"
      },
      {
        "name": "SK ANOWAR ALI",
        "cardNumber": "542129514"
      },
      {
        "name": "SK MOMTAZ BIBI",
        "cardNumber": "542129515"
      },
      {
        "name": "SK MORIJAN",
        "cardNumber": "542129516"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129558",
    "headName": "MUJIBAR RAHAMAN KAYAL",
    "phone": "",
    "category": "AAY",
    "memberCount": 13,
    "members": [
      {
        "name": "MAIDUL ISLAM KAYAL",
        "cardNumber": "542129562"
      },
      {
        "name": "MAIRA SULTANA KAYAL",
        "cardNumber": "2020524241"
      },
      {
        "name": "MOHIMA KAYAL",
        "cardNumber": "1205738117"
      },
      {
        "name": "MOSTAFIJUR RAHAMAN KAYAL",
        "cardNumber": "542129560"
      },
      {
        "name": "MUBASHIRA KAYAL",
        "cardNumber": "2012105979"
      },
      {
        "name": "MUJIBAR RAHAMAN KAYAL",
        "cardNumber": "542129558"
      },
      {
        "name": "NASEEM ARA KAYAL",
        "cardNumber": "1205738118"
      },
      {
        "name": "RIDWAN ISLAM KAYAL",
        "cardNumber": "2012853536"
      },
      {
        "name": "SABINA MONDAL KAYAL",
        "cardNumber": "1205738116"
      },
      {
        "name": "SAMIM AKTAR KAYAL",
        "cardNumber": "542129561"
      },
      {
        "name": "SAMIMA KAYAL",
        "cardNumber": "1205738115"
      },
      {
        "name": "SOVANA KAYAL",
        "cardNumber": "542129559"
      },
      {
        "name": "ZARIF AKTER KAYAL",
        "cardNumber": "1205738119"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129571",
    "headName": "GANGA METE",
    "phone": "9674970262",
    "category": "AAY",
    "memberCount": 3,
    "members": [
      {
        "name": "GANGA METE",
        "cardNumber": "542129571"
      },
      {
        "name": "PRATAP METEY",
        "cardNumber": "542129573"
      },
      {
        "name": "RABIN METE",
        "cardNumber": "542129570"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129612",
    "headName": "UDAY METE",
    "phone": "9330631176",
    "category": "AAY",
    "memberCount": 5,
    "members": [
      {
        "name": "PUJA METE",
        "cardNumber": "1217986501"
      },
      {
        "name": "SOMA METE",
        "cardNumber": "542129616"
      },
      {
        "name": "SUBRATA METE",
        "cardNumber": "542129615"
      },
      {
        "name": "TAPATI METE",
        "cardNumber": "542129613"
      },
      {
        "name": "UDAY METE",
        "cardNumber": "542129612"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "2014013138",
    "headName": "SK MUJIT",
    "phone": "7439212295",
    "category": "AAY",
    "memberCount": 5,
    "members": [
      {
        "name": "ASIFA KHATUN",
        "cardNumber": "2014013138"
      },
      {
        "name": "MARIYAM BIBI",
        "cardNumber": "542129620"
      },
      {
        "name": "SK ALAUDDIN",
        "cardNumber": "542129623"
      },
      {
        "name": "SK GIASUDDIN",
        "cardNumber": "542129621"
      },
      {
        "name": "SK RAKIB",
        "cardNumber": "2014026337"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129675",
    "headName": "SUMITRA METE",
    "phone": "",
    "category": "AAY",
    "memberCount": 5,
    "members": [
      {
        "name": "DINESH METE",
        "cardNumber": "542129674"
      },
      {
        "name": "PINKI METE",
        "cardNumber": "542129677"
      },
      {
        "name": "PINTU METE",
        "cardNumber": "542129676"
      },
      {
        "name": "PRITHA METE",
        "cardNumber": "2014016756"
      },
      {
        "name": "SUMITRA METE",
        "cardNumber": "542129675"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129716",
    "headName": "TARULATA DUTTA",
    "phone": "7278429286",
    "category": "AAY",
    "memberCount": 4,
    "members": [
      {
        "name": "DIPAK DUTTA",
        "cardNumber": "542129716"
      },
      {
        "name": "RAJKUMAR DUTTA",
        "cardNumber": "542129719"
      },
      {
        "name": "RUPAK DUTTA",
        "cardNumber": "542129718"
      },
      {
        "name": "RUPALI DUTTA",
        "cardNumber": "542129717"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129797",
    "headName": "RAMA RANI MATA",
    "phone": "",
    "category": "AAY",
    "memberCount": 2,
    "members": [
      {
        "name": "LALTU MATA",
        "cardNumber": "1205738137"
      },
      {
        "name": "RAMA RANI MATA",
        "cardNumber": "542129797"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129836",
    "headName": "SULOCHNA METE",
    "phone": "",
    "category": "AAY",
    "memberCount": 2,
    "members": [
      {
        "name": "AKASH METE",
        "cardNumber": "542129838"
      },
      {
        "name": "SULOCHNA METE",
        "cardNumber": "542129836"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129867",
    "headName": "GOLAM NURNABI KHAN",
    "phone": "6290949252",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "GOLAM NOORNABI KHAN",
        "cardNumber": "542129867"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129932",
    "headName": "RAHIMA BIBI",
    "phone": "",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "RAHIMA BEOYA",
        "cardNumber": "542129932"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129937",
    "headName": "BADRUNNESHA BIBI",
    "phone": "6291145722",
    "category": "AAY",
    "memberCount": 2,
    "members": [
      {
        "name": "AJIMUDDIN JAMADAR",
        "cardNumber": "542129936"
      },
      {
        "name": "BADRUNNESHA BIBI",
        "cardNumber": "542129937"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542129947",
    "headName": "SABINA YASMIN BIBI",
    "phone": "",
    "category": "AAY",
    "memberCount": 3,
    "members": [
      {
        "name": "SABINA YASMIN BIBI",
        "cardNumber": "542129947"
      },
      {
        "name": "SK IBRAHIM",
        "cardNumber": "542129946"
      },
      {
        "name": "SK SAJID ALAM",
        "cardNumber": "542129948"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542130050",
    "headName": "IKBAL MOLLA",
    "phone": "",
    "category": "AAY",
    "memberCount": 3,
    "members": [
      {
        "name": "IKBAL MOLLA",
        "cardNumber": "542130050"
      },
      {
        "name": "INJAMUL MOLLA",
        "cardNumber": "1223371433"
      },
      {
        "name": "SAHANARA BIBI",
        "cardNumber": "542130051"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542130094",
    "headName": "SAIRA BIBI",
    "phone": "7685884328",
    "category": "AAY",
    "memberCount": 6,
    "members": [
      {
        "name": "ANISA KHATUN",
        "cardNumber": "542130094"
      },
      {
        "name": "NAFISHA KHATUN",
        "cardNumber": "542130095"
      },
      {
        "name": "RESHMA KHATUN",
        "cardNumber": "542130096"
      },
      {
        "name": "SAHERA BIBI",
        "cardNumber": "542130092"
      },
      {
        "name": "SK SAIFUDDIN",
        "cardNumber": "542130091"
      },
      {
        "name": "SK SURABUDDIN",
        "cardNumber": "542130093"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "542130105",
    "headName": "JOTSNA MATA",
    "phone": "",
    "category": "AAY",
    "memberCount": 5,
    "members": [
      {
        "name": "ANANYA MATA",
        "cardNumber": "542130103"
      },
      {
        "name": "JOTSNA MATA",
        "cardNumber": "542130105"
      },
      {
        "name": "KHUKUMONOI MATA",
        "cardNumber": "542130102"
      },
      {
        "name": "NAKUL MATA",
        "cardNumber": "542130104"
      },
      {
        "name": "SANJAY MATA",
        "cardNumber": "542130101"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  },
  {
    "familyId": "1204994660",
    "headName": "SK MD REZAUL KARIM",
    "phone": "8910900546",
    "category": "AAY",
    "memberCount": 1,
    "members": [
      {
        "name": "SALIMA BIBI",
        "cardNumber": "1204994660"
      }
    ],
    "status": "active",
    "lifted": false,
    "notes": ""
  }
  ]);

  return NextResponse.json({ message: "Database seeded successfully" });
}