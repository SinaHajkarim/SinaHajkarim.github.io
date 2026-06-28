export const profile = {
  name: 'Sina M.H. Hajkarim',
  firstName: 'SINA',
  lastName: 'HAJKARIM',
  role: 'Autonomy / UxV Software Engineer — Ph.D., UK Global Talent',
  location: 'United Kingdom',
  coords: 'UK · GMT+0',
  lede:
    'Real-time autonomy engineer with 6+ years building safety-critical autonomy and state-estimation on real hardware — from fault-tolerant satellite attitude estimation under sensor dropout, through multi-agent autonomy verified closed-loop in flight, to a production multi-UxV fleet I own end-to-end today. Endorsed by the Royal Academy of Engineering in Autonomous Systems under the UK Global Talent route.',
  links: {
    linkedin: 'https://linkedin.com/in/sina-hajkarim-999250ab',
    scholar: 'https://scholar.google.com/citations?user=BIgbEtQAAAAJ',
  },
}

export const stats = [
  { value: 6, suffix: '+', label: 'Years building autonomy' },
  { value: 8, suffix: '', label: 'Peer-reviewed papers' },
  { value: 0, suffix: '', label: 'Production fleet owned', display: 'Multi' },
  { value: 0, suffix: '', label: 'Global Talent endorsed', display: 'UK GT' },
] as const

export type Job = {
  when: string
  title: string
  org: string
  detail: string
}

export const experience: Job[] = [
  {
    when: '2024 — PRESENT',
    title: 'Autonomy / UxV Software Engineer',
    org: 'ISS Aerospace · Chieveley, UK',
    detail:
      'Lead engineer for the end-to-end autonomy stack. Owned a real-time vision perception-and-control pipeline in production — trained, fine-tuned and deployed an object-tracking model on edge compute, closed-loop on production multi-vehicle hardware. Built the operator + fleet-orchestration stack from scratch in C++/Python over ROS2/MAVLink with Dockerised SITL ↔ on-hardware parity. Designed a multi-layer safety architecture from operator GUI down to safety-rated PLC. Industrial advisor on a KTP for safe multi-UxV applications.',
  },
  {
    when: '2021 — 2025',
    title: 'Ph.D. Researcher (Lead)',
    org: 'CRANE Lab · University of Exeter',
    detail:
      'Cooperative multi-drone mission planning for emergency flood response: MPC, rollout policy optimisation, and RL controllers deployed closed-loop on Crazyflie and Pixhawk/ArduPilot.',
  },
  {
    when: '2021 — 2025',
    title: 'Robotics Lab Lead & Teaching Associate',
    org: 'University of Exeter',
    detail:
      'Designed and ran the Kinova Gen3 7-DOF robotics laboratory from scratch on a ROS/ROS2 + Gazebo stack I built and maintained. Auxiliary teaching: MATLAB for engineers, SolidWorks design project, Fluid Mechanics lab.',
  },
  {
    when: '2019 — 2021',
    title: 'Research Assistant, Aerospace Control & Estimation',
    org: 'Sharif University of Technology',
    detail:
      'Published a modified Unscented Kalman Filter for gyroless faulty-sensor satellite ADCS (Acta Astronautica, 2022) — fault-tolerant state estimation under multi-sensor degradation. Co-authored 3 further peer-reviewed papers: 4 journal publications in 26 months.',
  },
]

export const education = [
  { yr: '2021 — 2025', what: 'Ph.D. Mathematics (Engineering focus)', where: 'University of Exeter · EPSRC-GCRF, fully funded' },
  { yr: '2016 — 2018', what: 'M.Sc. Aerospace Engineering', where: 'Sharif University of Technology' },
  { yr: '2011 — 2016', what: 'B.Sc. Aerospace Engineering', where: 'Azad University, Science & Research Branch' },
]

export type SkillGroup = { ref: string; title: string; items: string[] }

export const skills: SkillGroup[] = [
  { ref: 'REF A1', title: 'Perception & Fusion', items: ['Stereo depth (ZED)', 'LiDAR', 'Point cloud / PCL', 'IMU', 'VICON', 'EKF/UKF', 'Sensor fusion', 'OpenCV'] },
  { ref: 'REF A2', title: 'ML & Reinforcement Learning', items: ['PyTorch', 'TensorFlow', 'Stable-Baselines', 'CUDA', 'TensorRT', 'ONNX', 'NumPy', 'Detection & tracking', 'RL'] },
  { ref: 'REF A3', title: 'Robotics & Autonomy Stack', items: ['ROS / ROS2', 'Gazebo', 'NVIDIA Isaac Sim', 'MuJoCo', 'Pixhawk/ArduPilot', 'MAVLink/SITL', 'Crazyflie', 'Kinova Gen3'] },
  { ref: 'REF A4', title: 'Control, Estimation & Optimisation', items: ['MPC', 'EKF/UKF', 'Nonlinear opt.', 'Convex opt.', 'Trajectory opt.', 'IPOPT', 'Gurobi', 'YALMIP'] },
  { ref: 'REF A5', title: 'Hardware & Edge', items: ['NVIDIA Jetson', 'GPU acceleration', 'Beckhoff TwinCAT', 'TwinSAFE PLC', 'Raspberry Pi'] },
  { ref: 'REF A6', title: 'Software & Tooling', items: ['C/C++', 'Python', 'Rust', 'Linux', 'Docker', 'Git', 'CI/CD', 'MATLAB/Simulink', 'Julia', 'SolidWorks', 'STK'] },
]

export type Pub = { yr: string; title: string; venue: string; doi: string }

export const publications: Pub[] = [
  { yr: '2025', title: 'Safety-Guaranteed Lung-Protective Mechanical Ventilation using Digital Twins and Reinforcement Learning', venue: 'IEEE EMBC', doi: '10.1109/EMBC58623.2025.11253929' },
  { yr: '2025', title: 'Optimal spacecraft trajectory and formation control for asteroid deflection using pseudo-spectral methods and halo orbits', venue: 'J. Braz. Soc. Mech. Sci. & Eng.', doi: '10.1007/s40430-025-05797-2' },
  { yr: '2024', title: 'Cooperative Mission Planning Using Rollout Policy Optimization', venue: 'J. Aerospace Information Systems 21(10)', doi: '10.2514/1.I011330' },
  { yr: '2024', title: 'Optimised Mission Planning for Heterogeneous Uncrewed Vehicle Teams', venue: 'IEEE Access', doi: '10.1109/ACCESS.2024.3434529' },
  { yr: '2023', title: 'Multi-Agent Systems Learn to Safely Move in Indoor Environments', venue: '62nd IEEE CDC (presenter)', doi: '10.1109/CDC49753.2023.10383990' },
  { yr: '2023', title: 'Advanced fault detection and diagnosis in spacecraft attitude control systems', venue: 'Proc. IMechE Part G', doi: '10.1177/09544100231157132' },
  { yr: '2022', title: 'Attitude estimation and control based on modified UKF for gyro-less satellite with faulty sensors', venue: 'Acta Astronautica 191', doi: '10.1016/j.actaastro.2021.11.008' },
  { yr: '2022', title: 'Fault-tolerant control of flexible satellite with magnetic actuation and reaction wheel', venue: 'Proc. IMechE Part G 236(6)', doi: '10.1177/09544100211029497' },
]

export const sheets = [
  { id: 'hero', no: '00', label: 'GENERAL' },
  { id: 'about', no: '01', label: 'PROFILE' },
  { id: 'skills', no: '02', label: 'SYSTEMS' },
  { id: 'experience', no: '03', label: 'LOG' },
  { id: 'publications', no: '04', label: 'PAPERS' },
  { id: 'connect', no: '05', label: 'CONNECT' },
]
