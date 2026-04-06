import React, { useState, useEffect } from 'react';
import { Activity, Zap, Gauge } from 'lucide-react';
import axios from 'axios';

const BenchmarkDisplay = ({ idSanPham, loaiSanPham }) => {
  const [benchmark, setBenchmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBenchmark = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        const res = await axios.get(`${apiUrl}/benchmarks/${idSanPham}`);
        setBenchmark(res.data.data);
      } catch (err) {
        // Không có benchmark là bình thường
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    if (idSanPham) {
      fetchBenchmark();
    }
  }, [idSanPham]);

  if (loading) return <div className="text-center text-slate-500">Đang tải...</div>;
  if (!benchmark) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-200 mt-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
        <Activity size={24} className="text-blue-600" /> Thông tin Benchmark
      </h3>

      {/* CPU Benchmark */}
      {benchmark.cinebenchR23 && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Zap size={18} className="text-orange-600" /> Cinebench R23
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Single Core</p>
              <p className="text-2xl font-bold text-blue-600">{benchmark.cinebenchR23.single.toLocaleString()}</p>
              <p className="text-xs text-slate-500">điểm</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Multi Core</p>
              <p className="text-2xl font-bold text-blue-600">{benchmark.cinebenchR23.multi.toLocaleString()}</p>
              <p className="text-xs text-slate-500">điểm</p>
            </div>
          </div>
        </div>
      )}

      {/* Geekbench */}
      {benchmark.geekbench6 && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Gauge size={18} className="text-purple-600" /> Geekbench 6
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Single Core</p>
              <p className="text-2xl font-bold text-purple-600">{benchmark.geekbench6.single.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Multi Core</p>
              <p className="text-2xl font-bold text-purple-600">{benchmark.geekbench6.multi.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* GPU Benchmark */}
      {benchmark.fps1080p && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Gauge size={18} className="text-green-600" /> Gaming FPS
          </h4>
          <div className="space-y-3">
            {benchmark.fps1080p && (
              <div>
                <p className="text-sm text-slate-600 mb-2">1080p Highest</p>
                <div className="flex gap-2">
                  {benchmark.fps1080p.raytracing && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">{benchmark.fps1080p.raytracing} FPS (Ray)</span>}
                  {benchmark.fps1080p.normal && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{benchmark.fps1080p.normal} FPS</span>}
                </div>
              </div>
            )}
            {benchmark.fps1440p && (
              <div>
                <p className="text-sm text-slate-600 mb-2">1440p Highest</p>
                <div className="flex gap-2">
                  {benchmark.fps1440p.raytracing && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">{benchmark.fps1440p.raytracing} FPS (Ray)</span>}
                  {benchmark.fps1440p.normal && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{benchmark.fps1440p.normal} FPS</span>}
                </div>
              </div>
            )}
            {benchmark.fps4k && (
              <div>
                <p className="text-sm text-slate-600 mb-2">4K Highest</p>
                <div className="flex gap-2">
                  {benchmark.fps4k.raytracing && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">{benchmark.fps4k.raytracing} FPS (Ray)</span>}
                  {benchmark.fps4k.normal && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{benchmark.fps4k.normal} FPS</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TDP/Power */}
      {(benchmark.tdp || benchmark.powerConsumption) && (
        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Zap size={18} className="text-red-600" /> Thông số Năng lượng
          </h4>
          {benchmark.tdp && <p className="text-sm text-slate-600">TDP: <span className="font-bold text-red-600">{benchmark.tdp}W</span></p>}
          {benchmark.powerConsumption && <p className="text-sm text-slate-600">Tiêu thụ điện: <span className="font-bold">{benchmark.powerConsumption}</span></p>}
        </div>
      )}
    </div>
  );
};

export default BenchmarkDisplay;
