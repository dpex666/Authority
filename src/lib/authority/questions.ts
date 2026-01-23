import type { Question } from "./types";

export const QUESTIONS: Question[] = [
  // Decision Authority (25%)
  {
    id: "dec_1",
    pillar: "decision",
    title: "Is there one clearly nominated person to make final decisions if you can’t?",
    help: "Not “everyone will agree”. One person with final say.",
    type: "single",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
      { value: "na", label: "Not applicable" },
    ],
  },
  {
    id: "dec_2",
    pillar: "decision",
    title: "Have you told the relevant people who the decision holder is?",
    type: "single",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
      { value: "na", label: "Not applicable" },
    ],
  },
  {
    id: "dec_3",
    pillar: "decision",
    title: "How likely is it that two people would argue over ‘final say’?",
    help: "Be honest. This is about overlap and assumptions.",
    type: "scale",
  },

  // Access Authority (20%)
  {
    id: "acc_1",
    pillar: "access",
    title: "Could someone access your key financial accounts within 48 hours if needed?",
    help: "This is about access, not permission in theory.",
    type: "single",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
      { value: "na", label: "Not applicable" },
    ],
  },
  {
    id: "acc_2",
    pillar: "access",
    title: "Are important documents easy to locate (will, IDs, insurance, deeds)?",
    type: "single",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
      { value: "na", label: "Not applicable" },
    ],
  },
  {
    id: "acc_3",
    pillar: "access",
    title: "How dependent is your life admin on one person knowing everything?",
    type: "scale",
  },

  // Digital Authority (20%)
  {
    id: "dig_1",
    pillar: "digital",
    title: "Do you use a password manager with emergency access (or equivalent plan)?",
    type: "single",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
      { value: "na", label: "Not applicable" },
    ],
  },
  {
    id: "dig_2",
    pillar: "digital",
    title: "Is there a plan for your key digital accounts (email, socials, cloud, phone)?",
    type: "single",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
      { value: "na", label: "Not applicable" },
    ],
  },
  {
    id: "dig_3",
    pillar: "digital",
    title: "How exposed are your digital assets (crypto, creator revenue, subscriptions, devices)?",
    type: "scale",
  },

  // Executor Load & Capability (20%)
  {
    id: "exe_1",
    pillar: "executor",
    title: "Have you chosen someone who can realistically handle the executor load?",
    help: "Time, temperament, admin skills, and bandwidth.",
    type: "single",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
      { value: "na", label: "Not applicable" },
    ],
  },
  {
    id: "exe_2",
    pillar: "executor",
    title: "Would that person say ‘yes’ if asked today (no guilt, no pressure)?",
    type: "single",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
      { value: "na", label: "Not applicable" },
    ],
  },
  {
    id: "exe_3",
    pillar: "executor",
    title: "How likely is it your executor would burn out or get overwhelmed?",
    type: "scale",
  },

  // Family Alignment Risk (15%)
  {
    id: "ali_1",
    pillar: "alignment",
    title: "Do the key people in your life broadly agree on what you’d want?",
    type: "single",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
      { value: "na", label: "Not applicable" },
    ],
  },
  {
    id: "ali_2",
    pillar: "alignment",
    title: "Are there known tension points (money, roles, past conflicts) that could flare up?",
    type: "single",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
      { value: "na", label: "Not applicable" },
    ],
  },
  {
    id: "ali_3",
    pillar: "alignment",
    title: "How likely is it your family would dispute decisions or fairness?",
    type: "scale",
  },
];
