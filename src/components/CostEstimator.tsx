import { useState, useEffect, useMemo } from 'react';
import { CostEstimator as CostEstimatorType, CostCategory } from '@/types';
import { convertKRWToCAD, formatCurrency } from '@/utils/helpers';
import CostPieChart from './CostPieChart';

const CATEGORY_COLORS: { [key: string]: string } = {
  flight: '#fb7185', // rose-400
  accommodation: '#f87171', // red-400
  food: '#4ade80', // green-400
  transport: '#60a5fa', // blue-400
  activities: '#c084fc', // purple-400
  rent: '#f87171',
  utilities: '#facc15',
  mobile: '#c084fc',
  misc: '#fb923c',
};
interface CostDataByCity {
  [city: string]: CostEstimatorType;
}

interface CostEstimatorProps {
  allData: CostDataByCity;
  calculatorType: 'living' | 'travel';
}

export default function CostEstimator({ allData, calculatorType }: CostEstimatorProps) {
  const initialCityKey = Object.keys(allData)[0] || 'seoul';
  const [city, setCity] = useState(initialCityKey);
  const [currentCityData, setCurrentCityData] = useState(allData[initialCityKey]);
  const [currency, setCurrency] = useState<'KRW' | 'CAD'>(currentCityData?.currency || 'KRW');
  const [exchangeRate, setExchangeRate] = useState(currentCityData?.exchangeRateKRWPerCAD || 1000);
  const [exchangeRateAsOf, setExchangeRateAsOf] = useState(
    currentCityData?.exchangeRateAsOf || new Date().toISOString().split('T')[0]
  );
  
  const initialScenarioName = currentCityData.scenarios[0]?.name || 'Student basic';

  const [categories, setCategories] = useState<CostCategory[]>(
    currentCityData?.categories || []
  );
  const [tripDuration, setTripDuration] = useState<number>(7); // For travel calculator

  const [userSelections, setUserSelections] = useState<Record<string, string>>(() => {
    const initialSelections: Record<string, string> = {};
    currentCityData.categories.forEach(category => {
      if (category.calculationStrategy === 'pick_one') {
        const defaultItem = category.items.find(item => item.defaultFor?.includes(initialScenarioName));
        initialSelections[category.key] = defaultItem ? defaultItem.name : (category.items[0]?.name || '');
      }
    });
    return initialSelections;
  });

  const [activeScenario, setActiveScenario] = useState<string>(initialScenarioName);

  // City or data change effect
  useEffect(() => {
    const data = allData[city];
    if (data) {
      setCurrentCityData(data);
      setCurrency(data.currency);
      setExchangeRate(data.exchangeRateKRWPerCAD);
      setExchangeRateAsOf(data.exchangeRateAsOf);
      setCategories(data.categories);
      applyScenario(data.scenarios[0]?.name || 'Student basic', data);
    }
  }, [city, allData]);
  
  const applyScenario = (scenarioName: string, data = currentCityData) => {
    setActiveScenario(scenarioName);
    const newSelections: Record<string, string> = {};
    data.categories.forEach(category => {
      if (category.calculationStrategy === 'pick_one') {
        const defaultItem = category.items.find(item => item.defaultFor?.includes(scenarioName));
        newSelections[category.key] = defaultItem ? defaultItem.name : (category.items[0]?.name || '');
      }
    });
    setUserSelections(newSelections);
  };
  
  const handleSelectionChange = (categoryKey: string, itemName: string) => {
    const newSelections = { ...userSelections, [categoryKey]: itemName };
    setUserSelections(newSelections);

    let matchedScenario = 'Custom';
    currentCityData.scenarios.forEach(scenario => {
        let isMatch = true;
        currentCityData.categories.forEach(category => {
            if (category.calculationStrategy === 'pick_one') {
                const defaultItem = category.items.find(item => item.defaultFor?.includes(scenario.name));
                const defaultItemName = defaultItem ? defaultItem.name : (category.items[0]?.name || '');
                if (newSelections[category.key] !== defaultItemName) { isMatch = false; }
            }
        });
        if (isMatch) matchedScenario = scenario.name;
    });
    setActiveScenario(matchedScenario);
  };
  
  const updateCategoryItem = (categoryKey: string, itemName: string, newKrwValue: number) => {
    setCategories(prev => prev.map(c => 
        c.key === categoryKey ? { ...c, items: c.items.map(i => i.name === itemName ? { ...i, krw: newKrwValue } : i) } : c
    ));
    setActiveScenario('Custom');
  };

  const { totalKRW, chartData } = useMemo(() => {
    let total = 0;
    const categoryTotals: { [key: string]: number } = {};

    categories.forEach((category) => {
        let categoryTotal = 0;
        const strategy = category.calculationStrategy;
        const type = category.calculationType;

        if (strategy === 'sum') {
            categoryTotal = category.items.reduce((sum, item) => sum + item.krw, 0);
        } else { // pick_one
            const selectedItem = category.items.find(item => item.name === userSelections[category.key]);
            if (selectedItem) {
                categoryTotal = selectedItem.krw;
            }
        }
        
        if (calculatorType === 'travel' && type === 'per_day') {
            categoryTotal *= tripDuration;
        }

        categoryTotals[category.key] = categoryTotal;
        total += categoryTotal;
    });

    const finalChartData = Object.keys(categoryTotals).map(key => ({
        label: key,
        percentage: total > 0 ? categoryTotals[key] / total : 0,
        color: CATEGORY_COLORS[key] || '#9ca3af'
    })).filter(item => item.percentage > 0);

    return { totalKRW: total, chartData: finalChartData };
  }, [categories, userSelections, tripDuration, calculatorType]);

  const totalCAD = convertKRWToCAD(totalKRW, exchangeRate);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {calculatorType === 'living' ? 'Living Cost Estimator' : 'Travel Cost Estimator'}
        </h1>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500">
              {Object.keys(allData).map((cityKey) => (
                <option key={cityKey} value={cityKey}>{allData[cityKey].city}</option>
              ))}
            </select>
          </div>
          {calculatorType === 'travel' && (
            <div>
                <label htmlFor="tripDuration" className="block text-sm font-medium text-gray-700 mb-2">Trip Duration (Days)</label>
                <input type="number" id="tripDuration" value={tripDuration} onChange={(e) => setTripDuration(Math.max(1, Number(e.target.value)))} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"/>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value as 'KRW' | 'CAD')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500">
              <option value="KRW">Korean Won (₩)</option>
              <option value="CAD">Canadian Dollar (CAD$)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Rate (KRW/CAD)</label>
            <input type="number" value={exchangeRate} onChange={(e) => setExchangeRate(Number(e.target.value))} min="100" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"/>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Lifestyle Presets</h2>
        <div className="flex flex-wrap gap-3">
          {currentCityData.scenarios.map((scenario) => (
            <button key={scenario.name} onClick={() => applyScenario(scenario.name)} className={`voxy-button ${activeScenario === scenario.name ? 'voxy-button--active' : ''}`}>
              <span className="button_top">{scenario.name}</span>
            </button>
          ))}
          {activeScenario === 'Custom' && (
             <div className="voxy-button voxy-button--active">
              <span className="button_top">Custom</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.key} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{category.label}</h2>
            <div className="space-y-4">
              {category.calculationStrategy === 'pick_one' ? (
                category.items.map((item) => (
                  <div key={item.name} onClick={() => handleSelectionChange(category.key, item.name)} className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border-2 ${userSelections[category.key] === item.name ? 'border-primary-500 bg-primary-50' : 'border-transparent hover:bg-gray-50'}`}>
                    <input type="radio" name={category.key} value={item.name} checked={userSelections[category.key] === item.name} readOnly className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"/>
                    <div className="ml-3 flex-grow">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({item.unit})</span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">{formatCurrency(item.krw, 'KRW')}</span>
                    </div>
                  </div>
                ))
              ) : (
                category.items.map((item) => (
                  <div key={item.name} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="flex-grow">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({item.unit})</span>
                    </div>
                    <div>
                        <input type="number" value={item.krw} onChange={(e) => updateCategoryItem(category.key, item.name, Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500" />
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">{formatCurrency(item.krw, 'KRW')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

       <div className="sticky bottom-4 z-10">
        <div className="bg-primary-600 text-white rounded-2xl shadow-lg p-6 mt-6 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-grow">
                <h2 className="text-xl font-bold mb-2">
                  {calculatorType === 'travel' ? `Total for ${tripDuration} Days` : 'Monthly Total Estimate'}
                </h2>
                <p className="text-blue-100 text-sm">Based on <span className="font-bold capitalize">{activeScenario}</span> lifestyle in {currentCityData.city}</p>
                <div className="mt-2">
                    <div className="text-3xl font-bold">
                    {currency === 'KRW' ? formatCurrency(totalKRW, 'KRW') : formatCurrency(totalCAD, 'CAD')}
                    </div>
                    <div className="text-sm text-blue-200">
                    {currency === 'KRW' ? `≈ ${formatCurrency(totalCAD, 'CAD')}` : `≈ ${formatCurrency(totalKRW, 'KRW')}`}
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
                <CostPieChart data={chartData} />
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}
