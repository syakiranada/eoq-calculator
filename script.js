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

    const Q_star = model1Eoq(demand, orderCost, holdingCost);
    document.getElementById("qStar").textContent = Q_star.toFixed(2);

    const T_star = model2OptimalCycleTime(Q_star, demand);
    document.getElementById("tStar").textContent = T_star.toFixed(4);
    document.getElementById("tStarDays").textContent = (T_star * 365).toFixed(
      2
    );

    const f_star = model3OptimalFrequency(T_star);
    document.getElementById("fStar").textContent = f_star.toFixed(2);

    const C_Q_star_noP = model4TotalOptimalCost(
      orderCost,
      demand,
      holdingCost,
      Q_star
    );
    document.getElementById("cqStarNoP").textContent = C_Q_star_noP.toFixed(2);

    const C_Q_star_withP = model4TotalOptimalCost(
      orderCost,
      demand,
      holdingCost,
      Q_star,
      unitPrice
    );
    document.getElementById("cqStarWithP").textContent =
      C_Q_star_withP.toFixed(2);

    // ✅ Panggil fungsi untuk menampilkan ringkasan
    tampilkanRingkasan(Q_star, f_star);
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

function tampilkanRingkasan(qStar, fStar) {
  const summarySection = document.getElementById("summarySection");

  summarySection.innerHTML = `
    <h2>Ringkasan</h2>
    <p>
      Maka, jumlah <strong>bahan/produk</strong>
      yang sebaiknya diproduksi atau dipesan <strong>sekali waktu</strong> adalah sebanyak
      <strong>${qStar.toFixed(0)} unit</strong>.
    </p>
    <p>
      Dengan demikian, Anda disarankan untuk melakukan proses produksi/pengadaan ini
      sebanyak <strong>${fStar.toFixed(0)} kali dalam setahun</strong>.
    </p>
  `;
}
