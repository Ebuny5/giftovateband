import { HotspotData, BomItem } from '../types/biometrics';

export const HOTSPOTS_DATA: HotspotData[] = [
  {
    id: 1,
    title: 'Dual Ag/AgCl Dry EDA Electrodes',
    subtitle: 'Ventral Venting & Phasic Conductance',
    position: [0.65, -1.22, 0.45],
    normal: [0, -1, 0],
    category: 'sensor',
    specs: [
      { label: 'Electrode Contact Diameter', value: '6.8 mm' },
      { label: 'Electrode Coating', value: 'Sintered Ag/AgCl (Silver Chloride)' },
      { label: 'Sampling Rate', value: '32 Hz continuous (24-bit ADC)' },
      { label: 'Measurement Dynamic Range', value: '0.01 μS to 20.00 μS' },
      { label: 'Excitation Voltage', value: '0.5V constant DC current' }
    ],
    material: 'Medical 316L Stainless substrate with 15μm Sintered Ag/AgCl plating',
    tolerance: '±0.05 mm coplanarity',
    costPrototype: 6.80,
    costVolume: 2.10,
    description: 'Dry contact electrode pair engineered for uninterrupted long-term stratum corneum contact without conductive hydrogels. Captures both tonic baseline (SCL) and rapid micro-bursts of sudomotor nerve activity (SCR).',
    clinicalSignificance: 'Detects sympathetic eccrine sweat gland pre-filling 180–300 seconds before microscopic sweat droplets rupture onto the epidermis.'
  },
  {
    id: 2,
    title: 'Optical PPG Heart Rate / HRV Cluster',
    subtitle: 'Dual-Wavelength Arterial Photoplethysmography',
    position: [0, -1.25, 0],
    normal: [0, -1, 0],
    category: 'sensor',
    specs: [
      { label: 'Optical Emitters', value: 'Dual Green (525nm) + Infrared (940nm)' },
      { label: 'Photodetector Window', value: 'High-responsivity PIN photodiode' },
      { label: 'Dynamic Ambient Rejection', value: '> 80 dB DC optical cancellation' },
      { label: 'Pulse Accuracy', value: '±1 BPM (30–220 BPM range)' },
      { label: 'HRV Metrics', value: 'RMSSD, pNN50, LF/HF spectral ratio' }
    ],
    material: 'Optical-grade sapphire glass with anti-reflective & hydrophobic coating',
    tolerance: 'IP68 hermetic optical seal',
    costPrototype: 5.40,
    costVolume: 2.30,
    description: 'Central optoelectronic sensor measuring microvascular blood volume changes in the radial and ulnar collateral branches. Directly derives heart rate variability (HRV) to cross-validate autonomic arousal.',
    clinicalSignificance: 'A precipitous drop in RMSSD paired with elevated heart rate validates that an EDA surge is driven by sympathetic autonomic activation rather than motion artifact.'
  },
  {
    id: 3,
    title: 'Medical Thermistor (Skin Temperature)',
    subtitle: 'NTC Precision Surface Bead',
    position: [-0.65, -1.22, 0.45],
    normal: [0, -1, 0],
    category: 'sensor',
    specs: [
      { label: 'Sensor Type', value: 'High-precision NTC thermistor bead' },
      { label: 'Measurement Resolution', value: '0.02 °C' },
      { label: 'Absolute Accuracy', value: '±0.1 °C across 30°C–42°C' },
      { label: 'Thermal Response Time (τ)', value: '< 1.8 seconds to skin contact' }
    ],
    material: 'Direct thermally conductive copper pad interface with medical potting',
    tolerance: '±0.02 °C calibration drift/year',
    costPrototype: 2.90,
    costVolume: 0.95,
    description: 'Contact skin temperature sensor located adjacent to the EDA electrodes. Discerns whether autonomic perspiration is triggered by core thermoregulatory dissipation vs. emotional sympathetic arousal.',
    clinicalSignificance: 'Crucial differential diagnostic parameter: elevated temperature confirms thermal exertion sweating, whereas cold clammy skin during an EDA surge signals emotional/psychogenic hyperhidrosis.'
  },
  {
    id: 4,
    title: 'Ventral Ergonomic Sensor Pod',
    subtitle: 'Anatomical Wrist Contour Enclosure',
    position: [0, -1.35, 0],
    normal: [0, -1, 0],
    category: 'mechanical',
    specs: [
      { label: 'Contour Curvature Radius', value: 'R 28.5 mm anatomical arch' },
      { label: 'Skin Contact Pressure', value: 'Calibrated 15–20 mmHg (passive elastomeric)' },
      { label: 'Ingress Protection', value: 'IP68 (submersible to 3m for 60 min)' },
      { label: 'Total Thickness', value: '6.4 mm ultra-slim profile' }
    ],
    material: 'Hypoallergenic biocompatible PEEK (polyetheretherketone) with soft-touch matte finish',
    tolerance: 'ISO 10993 cytotoxicity compliant',
    costPrototype: 7.20,
    costVolume: 2.40,
    description: 'Custom-sculpted ventral pod designed to sit securely against the palmar wrist surface without venous compression. Keeps electrodes firmly seated even during vigorous arm swinging and athletic workouts.',
    clinicalSignificance: 'Maintains constant electrode-to-skin contact impedance, preventing loose-contact noise and false surge triggers during daily activities.'
  },
  {
    id: 5,
    title: 'Fluoroelastomer Sweat-Proof Wrist Strap',
    subtitle: 'Micro-Ribbed Breathable Band',
    position: [-1.4, 0, 0],
    normal: [-1, 0, 0],
    category: 'mechanical',
    specs: [
      { label: 'Material Durometer', value: '65 Shore A medical FKM elastomer' },
      { label: 'Sweat Evacuation Channels', value: '0.8 mm micro-ribbed ventral grooves' },
      { label: 'Clasp Mechanism', value: 'Flush titanium magnetic snap pin' },
      { label: 'Wrist Circumference Range', value: '135 mm to 215 mm' }
    ],
    material: 'Medical-grade fluorocarbon elastomer (FKM) with antimicrobial coating',
    tolerance: 'Tear strength > 25 kN/m',
    costPrototype: 4.80,
    costVolume: 1.80,
    description: 'High-performance strap engineered specifically for people with excessive perspiration. Interior micro-channels guide moisture away from the skin while ensuring the sensor pod stays pinned in place.',
    clinicalSignificance: 'Eliminates strap slippage and maceration of the skin underneath, allowing comfortable 24/7 continuous wear.'
  },
  {
    id: 6,
    title: 'Rigid-Flex MCU & BLE Architecture',
    subtitle: 'Nordic nRF52840 SoC & Analog Front End',
    position: [0, 0.45, 0],
    normal: [0, 1, 0],
    category: 'electronics',
    specs: [
      { label: 'Processor Core', value: '64 MHz ARM Cortex-M4F with FPU' },
      { label: 'Wireless Protocol', value: 'Bluetooth 5.3 Low Energy + 2.4GHz Proprietary' },
      { label: 'Analog Front End (AFE)', value: 'Custom 24-bit delta-sigma bio-impedance ADC' },
      { label: 'Onboard Flash Storage', value: '1 MB Flash + 256 KB RAM' },
      { label: 'Haptic Engine', value: 'LRA (Linear Resonant Actuator) silent driver' }
    ],
    material: '4-layer Polyimide Rigid-Flex PCB with ENIG gold surface finish',
    tolerance: '0.075 mm trace / space',
    costPrototype: 8.50,
    costVolume: 4.20,
    description: 'Ultra-compact electronic brain inside the band. Runs local digital signal processing (DSP) filters for motion artifact removal and real-time sudomotor peak detection before streaming via BLE.',
    clinicalSignificance: 'Processes raw conductance waves locally in micro-watts, executing on-device baseline tracking so warnings fire even if smartphone Bluetooth is temporarily disconnected.'
  },
  {
    id: 7,
    title: '180mAh Li-Po Cell & Magnetic Pogo Charger',
    subtitle: 'High Energy Density Micro-Battery',
    position: [0, 0.2, 0],
    normal: [0, 1, 0],
    category: 'electronics',
    specs: [
      { label: 'Nominal Capacity', value: '180 mAh @ 3.8V nominal' },
      { label: 'Battery Runtime', value: 'Up to 5 days continuous 32Hz EDA/PPG streaming' },
      { label: 'Charge Speed', value: '0 to 80% in 35 minutes via 2-pin magnetic pogo dock' },
      { label: 'Safety Protections', value: 'Integrated over-temp, over-voltage, & short circuit PCM' }
    ],
    material: 'Cobalt-free lithium polymer pouch cell with laser-welded tabs',
    tolerance: 'UL1642 & UN38.3 certified',
    costPrototype: 3.20,
    costVolume: 1.40,
    description: 'Custom-curved battery cell positioned between the rigid-flex PCB and the top display. Features gold-plated hermetic pogo charging contacts on the lateral chassis.',
    clinicalSignificance: 'Guarantees uninterrupted nocturnal monitoring—essential for identifying nocturnal hyperhidrosis and circadian autonomic tone.'
  },
  {
    id: 8,
    title: 'Micro-OLED Biometric HUD',
    subtitle: 'High-Contrast Active Matrix Readout',
    position: [0, 1.25, 0],
    normal: [0, 1, 0],
    category: 'display',
    specs: [
      { label: 'Display Technology', value: '0.96-inch PMOLED Monochrome Teal/White' },
      { label: 'Resolution', value: '128 x 64 pixels' },
      { label: 'Peak Brightness', value: '850 nits (sunlight legible)' },
      { label: 'Cover Glass', value: 'Chemically strengthened 2.5D Corning Gorilla Glass' }
    ],
    material: 'Anti-fingerprint oleophobic coated aluminosilicate cover glass',
    tolerance: 'Mohs hardness 7+',
    costPrototype: 4.00,
    costVolume: 1.70,
    description: 'Discreet top-facing display that provides instant live readouts of Heart Rate (BPM), Skin Conductance (μS), and proactive alerts. Dark mode OLED consumes zero power when displaying deep black backgrounds.',
    clinicalSignificance: 'Enables patients to glance at their current sympathetic arousal level discretely during professional meetings, dates, or exams without pulling out their phone.'
  }
];

export const BOM_ITEMS: BomItem[] = [
  {
    id: 1,
    name: 'Dual Ag/AgCl Sintered Contact Studs',
    partNumber: 'GV-EDA-ST01',
    category: 'Electrochemistry',
    material: 'Medical 316L Stainless with Sintered Ag/AgCl',
    costPrototype: 6.80,
    costVolume: 2.10,
    supplier: 'BioSensors Precision GmbH',
    leadTime: '3 Weeks',
    keyFeature: 'Dry contact, zero hydrogel degradation'
  },
  {
    id: 2,
    name: 'Dual-Wavelength PPG Optical Module',
    partNumber: 'GV-PPG-525940',
    category: 'Optoelectronics',
    material: 'Sapphire window + dual Green/IR emitters',
    costPrototype: 5.40,
    costVolume: 2.30,
    supplier: 'Osram Opto Semiconductors',
    leadTime: '2 Weeks',
    keyFeature: '80dB dynamic ambient light rejection'
  },
  {
    id: 3,
    name: 'Precision NTC Skin Thermistor',
    partNumber: 'GV-TH-02C',
    category: 'Thermal Sensor',
    material: 'NTC ceramic bead with copper contact interface',
    costPrototype: 2.90,
    costVolume: 0.95,
    supplier: 'Murata Manufacturing',
    leadTime: '1 Week',
    keyFeature: '±0.1°C medical diagnostic accuracy'
  },
  {
    id: 4,
    name: 'Ventral Anatomical Sensor Pod Shell',
    partNumber: 'GV-POD-PEEK28',
    category: 'Chassis & Housing',
    material: 'Biocompatible PEEK injection mold',
    costPrototype: 7.20,
    costVolume: 2.40,
    supplier: 'VeroMed Prototyping',
    leadTime: '4 Weeks',
    keyFeature: 'IP68 hermetic seal, 15-20 mmHg contact arch'
  },
  {
    id: 5,
    name: 'Fluoroelastomer Ribbed Strap Assembly',
    partNumber: 'GV-ST-FKM65',
    category: 'Strap & Clasp',
    material: 'Medical FKM 65 Shore A + Titanium pin',
    costPrototype: 4.80,
    costVolume: 1.80,
    supplier: 'Silicone Molding Solutions',
    leadTime: '3 Weeks',
    keyFeature: 'Micro-grooved sweat evacuation channels'
  },
  {
    id: 6,
    name: 'Nordic nRF52840 Rigid-Flex Subsystem',
    partNumber: 'GV-PCB-RF4L',
    category: 'Compute & RF',
    material: '4-layer Polyimide Rigid-Flex ENIG',
    costPrototype: 8.50,
    costVolume: 4.20,
    supplier: 'Shenzhen Fastprint Circuit',
    leadTime: '2 Weeks',
    keyFeature: 'ARM Cortex-M4F + 24-bit bio-impedance AFE'
  },
  {
    id: 7,
    name: '180mAh Li-Po Cell with Safety PCM',
    partNumber: 'GV-BAT-180LP',
    category: 'Power & Charging',
    material: 'Lithium Polymer Pouch + gold pogo pads',
    costPrototype: 3.20,
    costVolume: 1.40,
    supplier: 'Grepow Energy Corp',
    leadTime: '3 Weeks',
    keyFeature: '5 days runtime, 35 min fast charge'
  },
  {
    id: 8,
    name: '0.96" Micro-OLED Module & 2.5D Glass',
    partNumber: 'GV-DSP-OLED96',
    category: 'Display & Glass',
    material: '128x64 PMOLED + Corning Gorilla Glass',
    costPrototype: 4.00,
    costVolume: 1.70,
    supplier: 'WiseChip Semiconductor',
    leadTime: '2 Weeks',
    keyFeature: '850 nits daylight readability, deep black'
  }
];

export const PYTHON_BLE_CODE = `# =====================================================================
# Giftovate Band - Python BLE Telemetry Bridge to HidroAlly App
# Copyright (c) 2026 Giftovate Therapeutics Ltd. All rights reserved.
# =====================================================================
import asyncio
import struct
import json
import logging
from datetime import datetime
from bleak import BleakClient, BleakScanner

# Standard & Proprietary Bluetooth GATT UUIDs
GATT_HEART_RATE_MEASUREMENT  = "00002a37-0000-1000-8000-00805f9b34fb"
GATT_EDA_CHARACTERISTIC      = "0000eda1-0000-1000-8000-00805f9b34fb"
GATT_TEMPERATURE_CHAR        = "00002a1c-0000-1000-8000-00805f9b34fb"
GATT_HAPTIC_COMMAND_CHAR     = "0000eda2-0000-1000-8000-00805f9b34fb"

# Configurable Clinical Thresholds
EDA_SPIKE_THRESHOLD_US = 6.0    # Conductance surge threshold in microSiemens
HR_SURGE_THRESHOLD_BPM = 95     # Tachycardia correlation threshold

class GiftovateBandBridge:
    def __init__(self, target_address: str = None):
        self.target_address = target_address
        self.client: BleakClient = None
        self.tonic_baseline = 2.0
        self.last_eda = 2.1
        self.last_hr = 72

    def decode_heart_rate(self, data: bytearray) -> int:
        flags = data[0]
        # Flag bit 0: 0 = UINT8, 1 = UINT16
        if flags & 0x01:
            return struct.unpack("<H", data[1:3])[0]
        return data[1]

    def decode_eda(self, data: bytearray) -> float:
        # 24-bit fixed point microSiemens payload (uS)
        raw_val = struct.unpack("<I", data[:3] + b'\\x00')[0]
        return round(raw_val / 1000.0, 3)

    def on_eda_packet(self, sender, data: bytearray):
        self.last_eda = self.decode_eda(data)
        self.evaluate_sympathetic_surge()

    def on_hr_packet(self, sender, data: bytearray):
        self.last_hr = self.decode_heart_rate(data)

    def evaluate_sympathetic_surge(self):
        delta = self.last_eda - self.tonic_baseline
        logging.info(f"[{datetime.now().strftime('%H:%M:%S')}] HR: {self.last_hr} BPM | EDA: {self.last_eda} uS (Δ: {delta:+.2f} uS)")
        
        # Check for pre-sweat sudomotor surge
        if self.last_eda >= EDA_SPIKE_THRESHOLD_US:
            logging.warning("⚠️  SUDOMOTOR SURGE DETECTED! Pre-sweat window active (~180s)")
            asyncio.create_task(self.dispatch_hidroally_push_alert(self.last_eda, self.last_hr))

    async def dispatch_hidroally_push_alert(self, eda: float, hr: int):
        payload = {
            "device": "Giftovate Band v0.1",
            "alert": "SYMPATHETIC_SURGE_DETECTED",
            "eda_microsiemens": eda,
            "heart_rate_bpm": hr,
            "estimated_sweat_onset_seconds": 180,
            "recommended_action": "START_IONTOPHORESIS_SESSION",
            "compatible_devices": ["HydroGlove", "HydroVisage", "HydroSock"],
            "treatment_modality": "Tap-Water Iontophoresis (12mA DC)",
            "timestamp": datetime.utcnow().isoformat()
        }
        # Transmit payload via WebSocket to HidroAlly Companion App
        print(f">> [HIDROALLY WEBSOCKET PUSH] >>> {json.dumps(payload)}")
        # Send silent LRA haptic trigger command back to Band
        if self.client and self.client.is_connected:
            await self.client.write_gatt_char(GATT_HAPTIC_COMMAND_CHAR, b'\\x01\\x03')

    async def run(self):
        print("🔍 Scanning for Giftovate Band...")
        device = await BleakScanner.find_device_by_filter(
            lambda d, ad: d.name and "Giftovate" in d.name
        )
        if not device:
            print("Band not found nearby. Running simulation bridge...")
            return

        async with BleakClient(device) as client:
            self.client = client
            print(f" Connected to {device.name} [{device.address}]")
            await client.start_notify(GATT_EDA_CHARACTERISTIC, self.on_eda_packet)
            await client.start_notify(GATT_HEART_RATE_MEASUREMENT, self.on_hr_packet)
            
            while True:
                await asyncio.sleep(1)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    bridge = GiftovateBandBridge()
    asyncio.run(bridge.run())
`;
