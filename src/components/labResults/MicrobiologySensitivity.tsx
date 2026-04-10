import { useState } from 'react';
import { Bug, Plus, X } from 'lucide-react';
import {
  MicrobiologyOrganism,
  AntibioticSensitivity,
  SensitivityResult,
  COMMON_ANTIBIOTICS,
  COMMON_ORGANISMS,
} from '../../types/labResults';

interface MicrobiologySensitivityProps {
  onResultChange: (organisms: MicrobiologyOrganism[], sensitivities: Record<string, AntibioticSensitivity[]>) => void;
}

export default function MicrobiologySensitivity({ onResultChange }: MicrobiologySensitivityProps) {
  const [organisms, setOrganisms] = useState<MicrobiologyOrganism[]>([]);
  const [selectedOrganism, setSelectedOrganism] = useState('');
  const [colonyCount, setColonyCount] = useState('');
  const [sensitivities, setSensitivities] = useState<Record<string, AntibioticSensitivity[]>>({});

  const handleAddOrganism = () => {
    if (!selectedOrganism || !colonyCount) return;

    const organism = COMMON_ORGANISMS.find((o) => o.id === selectedOrganism);
    if (!organism) return;

    const newOrganism: MicrobiologyOrganism = {
      id: organism.id,
      name: organism.name,
      atccCode: organism.atccCode,
      colonyCount: colonyCount,
    };

    const updatedOrganisms = [...organisms, newOrganism];
    setOrganisms(updatedOrganisms);

    const defaultSensitivities: AntibioticSensitivity[] = COMMON_ANTIBIOTICS.map((ab) => ({
      antibiotic: ab.name,
      antibioticCode: ab.code,
      result: 'ND',
      micValue: '',
    }));

    const updatedSensitivities = {
      ...sensitivities,
      [organism.id]: defaultSensitivities,
    };
    setSensitivities(updatedSensitivities);

    onResultChange(updatedOrganisms, updatedSensitivities);

    setSelectedOrganism('');
    setColonyCount('');
  };

  const handleRemoveOrganism = (organismId: string) => {
    const updatedOrganisms = organisms.filter((o) => o.id !== organismId);
    setOrganisms(updatedOrganisms);

    const updatedSensitivities = { ...sensitivities };
    delete updatedSensitivities[organismId];
    setSensitivities(updatedSensitivities);

    onResultChange(updatedOrganisms, updatedSensitivities);
  };

  const handleSensitivityChange = (
    organismId: string,
    antibioticCode: string,
    result: SensitivityResult
  ) => {
    const updatedSensitivities = { ...sensitivities };
    const orgSensitivities = updatedSensitivities[organismId] || [];
    const index = orgSensitivities.findIndex((s) => s.antibioticCode === antibioticCode);

    if (index !== -1) {
      orgSensitivities[index] = { ...orgSensitivities[index], result };
      updatedSensitivities[organismId] = orgSensitivities;
      setSensitivities(updatedSensitivities);
      onResultChange(organisms, updatedSensitivities);
    }
  };

  const handleMicChange = (organismId: string, antibioticCode: string, micValue: string) => {
    const updatedSensitivities = { ...sensitivities };
    const orgSensitivities = updatedSensitivities[organismId] || [];
    const index = orgSensitivities.findIndex((s) => s.antibioticCode === antibioticCode);

    if (index !== -1) {
      orgSensitivities[index] = { ...orgSensitivities[index], micValue };
      updatedSensitivities[organismId] = orgSensitivities;
      setSensitivities(updatedSensitivities);
      onResultChange(organisms, updatedSensitivities);
    }
  };

  const getSensitivityColor = (result: SensitivityResult) => {
    switch (result) {
      case 'S':
        return 'bg-green-100 text-green-900 border-green-400';
      case 'I':
        return 'bg-amber-100 text-amber-900 border-amber-400';
      case 'R':
        return 'bg-rose-100 text-rose-900 border-rose-400';
      case 'ND':
        return 'bg-slate-100 text-slate-500 border-slate-300';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Bug className="w-5 h-5 text-teal-600" />
        <h3 className="text-sm font-bold text-slate-900 uppercase">Microbiology Results</h3>
      </div>

      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Add Organism</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Organism (ATCC Code)
            </label>
            <select
              value={selectedOrganism}
              onChange={(e) => setSelectedOrganism(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select organism...</option>
              {COMMON_ORGANISMS.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.atccCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Colony Count</label>
            <input
              type="text"
              value={colonyCount}
              onChange={(e) => setColonyCount(e.target.value)}
              placeholder="e.g., 10^5"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        <button
          onClick={handleAddOrganism}
          disabled={!selectedOrganism || !colonyCount}
          className="mt-3 w-full px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Organism
        </button>
      </div>

      {organisms.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
          <Bug className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-semibold">No organisms identified</p>
          <p className="text-xs text-slate-500">Add an organism to begin sensitivity testing</p>
        </div>
      ) : (
        <div className="space-y-6">
          {organisms.map((organism) => (
            <div key={organism.id} className="border-2 border-slate-300 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Bug className="w-5 h-5 text-teal-600" />
                    <h4 className="text-sm font-bold text-slate-900">{organism.name}</h4>
                  </div>
                  <div className="text-xs text-slate-600">{organism.atccCode}</div>
                  <div className="text-xs text-slate-700 font-semibold mt-1">
                    Colony Count: {organism.colonyCount} CFU/mL
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveOrganism(organism.id)}
                  className="p-1.5 hover:bg-rose-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-rose-600" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <h5 className="text-xs font-bold text-slate-700 uppercase mb-3">
                  Antibiotic Sensitivity Panel
                </h5>
                <div className="grid grid-cols-1 gap-2">
                  {sensitivities[organism.id]?.map((sens) => (
                    <div
                      key={sens.antibioticCode}
                      className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border border-slate-200"
                    >
                      <div className="col-span-4">
                        <div className="text-xs font-semibold text-slate-900">{sens.antibiotic}</div>
                        <div className="text-xs text-slate-600 font-mono">{sens.antibioticCode}</div>
                      </div>
                      <div className="col-span-4 flex gap-1">
                        {(['S', 'I', 'R', 'ND'] as SensitivityResult[]).map((result) => (
                          <button
                            key={result}
                            onClick={() =>
                              handleSensitivityChange(organism.id, sens.antibioticCode, result)
                            }
                            className={`flex-1 px-2 py-1.5 text-xs font-bold rounded border-2 transition-colors ${
                              sens.result === result
                                ? getSensitivityColor(result)
                                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {result}
                          </button>
                        ))}
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={sens.micValue || ''}
                          onChange={(e) =>
                            handleMicChange(organism.id, sens.antibioticCode, e.target.value)
                          }
                          placeholder="MIC value..."
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
        <div className="text-xs font-bold text-blue-900 mb-2">Sensitivity Legend:</div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 border-2 border-green-400 rounded flex items-center justify-center font-bold text-green-900">
              S
            </div>
            <span className="text-slate-700">Susceptible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-100 border-2 border-amber-400 rounded flex items-center justify-center font-bold text-amber-900">
              I
            </div>
            <span className="text-slate-700">Intermediate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-rose-100 border-2 border-rose-400 rounded flex items-center justify-center font-bold text-rose-900">
              R
            </div>
            <span className="text-slate-700">Resistant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-100 border-2 border-slate-300 rounded flex items-center justify-center font-bold text-slate-500">
              ND
            </div>
            <span className="text-slate-700">Not Done</span>
          </div>
        </div>
      </div>
    </div>
  );
}
