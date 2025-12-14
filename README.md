# TulipTrack
HackNYU 2025. Watch the demo [here](https://www.youtube.com/watch?v=Cn11z7-Yju0)

## 🌟 Inspiration
Over **500,000** Americans have Parkinson's Disease, and thousands more go undiagnosed and untreated. Elderly people with Parkinson's rarely know how their medication is affecting them, so we wanted to bring independence and autonomy to them. This way, they can take care of their condition without relying on their family members or doctor to update them with new developments in their treatment.

## 🛠️ What it does
TulipTrack allows patients with Parkinson's to see how their medication is affecting their symptoms in a simple, user-friendly way. A patient can add their **family members** so they have access to their data, just in case they have a tremor attack and need assistance. This way, relatives can know how they're doing without having to go and meet them in person. Patients and added family members can see 

- Current live data
- Longtime tremor data
- Current and past medication

TulipTrack is also for **doctors**, so they can see how their patients are doing without seeing them in person. They have remote access to a database (made using MongoDB Atlas) of their patients and their patients' data. Our doctor page allows doctors to see a list of their patients, their statuses, and their patients' data.

TulipTrack is completely HIPAA compliant, and the sharing of any patient data goes through all the necessary forms needed to ensure patient-doctor confidentiality. The patient can remove a family member's access at any point, and change what family members can see, with the click of a button.

## 🧱 How we built it
We used a Seeed Studio XIAO nRF52840 Sense's accelerometer and gyroscope data to track the hand tremors of a user. Using data of Parkinson's patients available on Kaggle, we developed an algorithm that detects when the wearer is having a "tremor attack," or a series of severe tremors that requires medical attention or medication.

The TulipTrack website uses React for the frontend, and MongoDB to store patient data coming in through the XIAO. The frontend utilizes MaterialUI Components to build tables, boxes, toolbars, and more throughout the website. The website displays two main parts: a patient view of the patients live hand tremors, the patients long term tremor data, and a calendar with reminders on taking medications, appointments, etc. , and the website has a doctor's view, displaying all patients and their basic information as well as  the patients live hand tremors and the patients long term tremor data.

## ⚔️ Challenges we ran into
- Getting the XIAO connected to the website via Bluetooth
- Alert system for telling the user they're having a tremor attack

## 🎖️Our Accomplishments
We've successfully integrated our software _and_ hardware--a far-fetched goal we had while brainstorming. Our website has a working doctor and patient page, so we can simulate what both ends will look like. This is essential for seeing how scalable and practical TulipTrack is, and we're pretty proud of it.


# Members
| Name                | GitHub Username |
| ------------------- | --------------- | 
| Gloria Zhu          | gzhu725         |
| Meghana Madiraju    | MeghanaM4       |
| Joy Wang            | jabnow          |
| Karmanyaah Malhotra | karmanyaahm     |
