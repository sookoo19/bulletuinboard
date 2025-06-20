import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ← 追加
import { Link } from "react-router-dom";

export const CreateThreads = () => {
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState("");
  const [country, setCountry] = useState([]);
  const [title, setTitle] = useState([]);
  const navigate = useNavigate(); // ← 追加

  // 国一覧を取得
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2,translations") //name,cca2,translationsを取得
      .then((res) => res.json())
      .then((data) => {
        console.log("取得した国データ:", data);

        // 日本語国名でソート
        const sorted = [...data].sort((a, b) =>
          (a.translations?.jpn?.common || a.name.common).localeCompare(
            b.translations?.jpn?.common || b.name.common,
            "ja"
          )
        );
        console.log("ソート後:", sorted);
        setCountries(sorted);
      });
  }, []);

  // 選択された国の情報を取得
  useEffect(() => {
    if (selected) {
      fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(
          selected
        )}?fullText=true`
      )
        .then((res) => res.json())
        .then((data) => setCountry(data[0])); //[0]は配列の最初の国情報を指定している
    }
  }, [selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 必要に応じてバリデーション
    if (!title) {
      alert("タイトルを入力してください");
      return;
    }

    //選択された国の情報を取得
    const selectedCountry = country;

    const body = {
      title,
      countryName: selectedCountry
        ? selectedCountry.translations?.jpn?.common ||
          selectedCountry.name.common
        : "",
      countryCode: selectedCountry ? selectedCountry.cca2 : "",
    };

    //この部分のAPIがcountryNameやcountryCodeに対応しないとpostできない
    const res = await fetch(
      "https://railway.bulletinboard.techtrain.dev/threads",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (res.ok) {
      alert("スレッドを作成しました");
      // スレッド一覧ページへ遷移
      navigate("/threads");
    } else {
      alert("作成に失敗しました");
    }
  };

  return (
    <div>
      <h2 className="thread-title">新規スレッド作成</h2>
      <form className="threadsForm" onSubmit={handleSubmit}>
        <label className="selectcountry" id="selectcountry">
          対象国：
        </label>
        <br />
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">全世界</option>
          {countries.map((country) => (
            <option key={country.cca2} value={country.name.common}>
              {country.translations?.jpn?.common || country.name.common}
            </option>
          ))}
        </select>
        <br />
        <label>スレッドタイトル：</label>
        <input
          type="text"
          className="threadsFormTitle"
          id="createTitle"
          placeholder="タイトルを入力してください"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <button type="submit">スレッドを作成</button>
      </form>
      <br />
      <Link to="/threads">TOPへ</Link>
    </div>
  );
};
