function model1Eoq(d_demand_annual, k_ordering_cost, ch_holding_cost_per_unit) {
  if (ch_holding_cost_per_unit <= 0) {
    throw new Error(
      "Biaya penyimpanan per unit (Ch) harus lebih besar dari nol."
    );
  }
  const q_optimal = Math.sqrt(
    (2 * k_ordering_cost * d_demand_annual) / ch_holding_cost_per_unit
  );
  return q_optimal;
}

function model2OptimalCycleTime(q_optimal, d_demand_annual) {
  if (d_demand_annual <= 0) {
    throw new Error(
      "Jumlah permintaan tahunan (D) harus lebih besar dari nol."
    );
  }
  const t_optimal = q_optimal / d_demand_annual;
  return t_optimal;
}

function model3OptimalFrequency(t_optimal, time_unit_total = 1) {
  if (t_optimal <= 0) {
    throw new Error(
      "Waktu optimal siklus pemesanan (T*) harus lebih besar dari nol."
    );
  }
  const f_optimal = 1 / t_optimal;
  return f_optimal;
}

function model4TotalOptimalCost(
  k_ordering_cost,
  d_demand_annual,
  ch_holding_cost_per_unit,
  q_optimal,
  p_unit_price = 0
) {
  if (q_optimal <= 0) {
    throw new Error("Jumlah barang optimal (Q*) harus lebih besar dari nol.");
  }

  // Biaya pemesanan
  const ordering_cost = (k_ordering_cost * d_demand_annual) / q_optimal;

  // Biaya penyimpanan
  const holding_cost = (ch_holding_cost_per_unit * q_optimal) / 2;

  // Biaya total (tanpa harga unit)
  let total_cost = ordering_cost + holding_cost;

  // Jika harga unit disertakan, tambahkan biaya pembelian
  if (p_unit_price > 0) {
    total_cost += p_unit_price * d_demand_annual;
  }

  return total_cost;
}

function hitungEOQ() {
  const demand = parseFloat(document.getElementById("demand").value);
  const orderCost = parseFloat(document.getElementById("orderCost").value);
  const holdingCost = parseFloat(document.getElementById("holdingCost").value);
  const unitPrice = parseFloat(document.getElementById("unitPrice").value);
  const timeUnit = document.getElementById("timeUnit").value;

  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.textContent = ""; // Clear previous errors

  try {
    if (isNaN(demand) || isNaN(orderCost) || isNaN(holdingCost)) {
      throw new Error(
        "Mohon isi semua nilai masukan yang wajib (Permintaan, Biaya Pemesanan, Biaya Penyimpanan)."
      );
    }
    if (demand < 0 || orderCost < 0 || holdingCost < 0 || unitPrice < 0) {
      throw new Error("Nilai masukan tidak boleh negatif.");
    }

    // --- Konversi ke Tahunan di sini ---
    let d_demand_annual_converted = demand;
    let ch_holding_cost_per_unit_converted = holdingCost;
    let conversionFactorToAnnual = 1; // Default: already annual

    if (timeUnit === "month") {
      d_demand_annual_converted = demand * 12;
      ch_holding_cost_per_unit_converted = holdingCost * 12; // Jika biaya penyimpanan per bulan, maka dikalikan 12 untuk per tahun
      conversionFactorToAnnual = 12; // 12 bulan dalam setahun
    } else if (timeUnit === "week") {
      d_demand_annual_converted = demand * 52;
      ch_holding_cost_per_unit_converted = holdingCost * 52; // Jika biaya penyimpanan per minggu
      conversionFactorToAnnual = 52; // 52 minggu dalam setahun
    }
    // else if (timeUnit === "day") {
    //   d_demand_annual_converted = demand * 365;
    //   ch_holding_cost_per_unit_converted = holdingCost * 365; // Jika biaya penyimpanan per hari
    // }

    // const Q_star = model1Eoq(demand, orderCost, holdingCost);
    // document.getElementById("qStar").textContent = Q_star.toFixed(2);
    const Q_star = model1Eoq(
      d_demand_annual_converted,
      orderCost,
      ch_holding_cost_per_unit_converted
    );
    document.getElementById("qStar").textContent = Q_star.toLocaleString(
      "id-ID",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

    // const T_star = model2OptimalCycleTime(Q_star, demand);
    // document.getElementById("tStar").textContent = T_star.toFixed(4);
    // document.getElementById("tStarDays").textContent = (T_star * 365).toFixed(
    //   2
    // );
    // Perhitungan T_star dan f_star tetap menggunakan D_demand_annual_converted
    const T_star_annual = model2OptimalCycleTime(
      Q_star,
      d_demand_annual_converted
    ); // T* dalam tahun
    // T_star untuk tampilan dalam satuan waktu yang dipilih
    const T_star_display = T_star_annual * conversionFactorToAnnual;
    // Teks untuk T*
    let tStarLabel = "";
    if (timeUnit === "month") {
      tStarLabel = "bulan";
    } else if (timeUnit === "week") {
      tStarLabel = "minggu";
    }
    document.getElementById(
      "tStar"
    ).textContent = `${T_star_display.toLocaleString("id-ID", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    })} ${tStarLabel}`;

    document.getElementById("tStarDays").textContent = (
      T_star_annual * 365
    ).toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    // document.getElementById("tStar").textContent = T_star.toFixed(4);
    // document.getElementById("tStarDays").textContent = (T_star * 365).toFixed(
    //   2
    // );

    const f_star_annual = model3OptimalFrequency(T_star_annual);
    // document.getElementById("fStar").textContent = f_star.toFixed(2);
    // f_star untuk tampilan dalam satuan waktu yang dipilih
    const f_star_display = f_star_annual / conversionFactorToAnnual;

    document.getElementById("fStar").textContent =
      f_star_display.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    // Menambahkan label satuan waktu ke frekuensi
    let fStarLabel = "";
    if (timeUnit === "month") {
      fStarLabel = "kali per bulan";
    } else if (timeUnit === "week") {
      fStarLabel = "kali per minggu";
    }
    document.getElementById("fStarLabel").textContent = fStarLabel;

    // const C_Q_star_noP = model4TotalOptimalCost(
    //   orderCost,
    //   demand,
    //   holdingCost,
    //   Q_star
    // );
    const C_Q_star_noP_annual = model4TotalOptimalCost(
      orderCost,
      d_demand_annual_converted,
      ch_holding_cost_per_unit_converted,
      Q_star
    );
    // Konversi biaya total ke satuan waktu yang dipilih
    const C_Q_star_noP_display = C_Q_star_noP_annual / conversionFactorToAnnual;
    document.getElementById("cqStarNoP").textContent =
      C_Q_star_noP_display.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    // const C_Q_star_withP = model4TotalOptimalCost(
    //   orderCost,
    //   demand,
    //   holdingCost,
    //   Q_star,
    //   unitPrice
    // );
    const C_Q_star_withP_annual = model4TotalOptimalCost(
      orderCost,
      d_demand_annual_converted,
      ch_holding_cost_per_unit_converted,
      Q_star,
      unitPrice
    );
    // Konversi biaya total ke satuan waktu yang dipilih
    const C_Q_star_withP_display =
      C_Q_star_withP_annual / conversionFactorToAnnual;
    document.getElementById("cqStarWithP").textContent =
      C_Q_star_withP_display.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    //Panggil fungsi untuk menampilkan ringkasan
    tampilkanRingkasan(Q_star, f_star_display);
  } catch (error) {
    errorMessageElement.textContent = `Error: ${error.message}`;
    document.getElementById("qStar").textContent = "";
    document.getElementById("tStar").textContent = "";
    document.getElementById("tStarDays").textContent = "";
    document.getElementById("fStar").textContent = "";
    document.getElementById("cqStarNoP").textContent = "";
    document.getElementById("cqStarWithP").textContent = "";
    document.getElementById("summarySection").innerHTML = ""; // Kosongkan ringkasan jika error
  }
}

function tampilkanRingkasan(qStar, fStarDisplay) {
  const timeUnit = document.getElementById("timeUnit").value;
  const summarySection = document.getElementById("summarySection");

  let unitLabel;
  if (timeUnit === "month") unitLabel = "sebulan";
  else if (timeUnit === "week") unitLabel = "seminggu";
  else if (timeUnit === "day") unitLabel = "sehari";
  else unitLabel = "setahun";

  summarySection.innerHTML = `
    <h2>Ringkasan</h2>
    <p>
      Maka, jumlah <strong>bahan/produk</strong>
      yang sebaiknya diproduksi atau dipesan <strong>sekali waktu</strong> adalah sebanyak
      <strong>${qStar.toLocaleString("id-ID", {
        maximumFractionDigits: 0,
      })} unit</strong>.
    </p>
    <p>
      Dengan demikian, Anda disarankan untuk melakukan proses produksi/pengadaan ini
      sebanyak <strong>${fStarDisplay.toLocaleString("id-ID", {
        maximumFractionDigits: 0,
      })} kali dalam ${unitLabel}</strong>.
    </p>
  `;
}
