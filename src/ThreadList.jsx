//@ts-check
import { useState, useEffect } from "react";

export const ThreadList = () => {
    const [threads, setThreads] = useState([]);
    const [country, setCountry] = useState(null);

    //スレッドAPIのデータを取得する
    useEffect(()=>{
        fetch("https://railway.bulletinboard.techtrain.dev/threads")
            .then(res => res.json())
            .then(data => setThreads(data))
            .catch(err => console.error(err));
    }, []);


    return(
        //htmlを記述できる
        //mapメソッドで配列の各要素を新しい配列に変換する
        <div>
            <h2 className="thread-title">新着スレッド</h2>
            <table>
                {threads.map((thread) => (
                    <tr>
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
                        </td>
                        <td className="threads">
                            {thread.title}
                        </td>
                    </tr>
                ))}
            </table>
        </div>

    );
}