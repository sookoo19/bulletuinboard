import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export const ThreadList = () => {
    const [threads, setThreads] = useState([]);
    const [countries, setCountries] = useState([]);

    //スレッドAPIのデータを取得する
    useEffect(()=>{
        fetch("https://railway.bulletinboard.techtrain.dev/threads")
            .then(res => res.json())
            .then(data => {
                console.log("取得したスレッド一覧:", data);
                setThreads(data || []);
            })
            .catch(err => console.error(err));
    }, []);

    // 国一覧APIを取得
    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all?fields=name,cca2,translations")
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(err => console.error(err));
    }, []);

    // countryCodeから国名（日本語）を取得する関数
    const getCountryName = (code) => {
        const country = countries.find(c => c.cca2 === code);
        return country ? (country.translations?.jpn?.common || country.name.common) : "全世界";
    };


    return(
        //htmlを記述できる
        //mapメソッドで配列の各要素を新しい配列に変換する
        <div>
            <h2 className="thread-title">新着スレッド</h2>
            <a href="/threads/new" target="_blank" rel="noopener">
            <button className="createButton">新規スレッド作成</button>
            </a>
            <table>
                <tbody>
                    {threads.slice(0, 10).map((thread) => (
                        console.log(thread),
                        <tr key={thread.id}>
                            <td className="countryThreads">
                                {/* 国コードがある場合は国旗、ない場合はデフォルト画像 */}
                            <img
                                src={
                                    thread.countryCode
                                        ? `https://flagcdn.com/48x36/${thread.countryCode.toLowerCase()}.png`
                                        : '/earth.png' // publicフォルダにno-country.pngを置いてください
                                }
                                alt={thread.countryName || "world"}
                            />
                            <span>
                                    {getCountryName(thread.countryCode)}
                            </span>
                            </td>
                            <td className="threads">
                                <Link to={`/threads/${thread.id}`}>
                                {thread.title}
                                </Link>                            
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
}