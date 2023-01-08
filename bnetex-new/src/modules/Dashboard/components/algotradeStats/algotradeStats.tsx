import clsx from "clsx";
import { useGoToState } from "lib/hooks/useGoToState";
import { useTypedSelector } from "lib/hooks/useTypedSelector";
import { Button } from "lib/ui-kit";
import SignedNumber from "modules/Global/components/signedNumber/signedNumber";
import { AppLinksEnum } from "routes/appLinks";
import styles from "./algotradeStats.module.scss";
import { calculateElapsedTime } from "lib/utils/calculateElapsedTime";
import { Power } from "assets/images/icons";

const AlgotradeStats = () => {

  const { goToState } = useGoToState();

  const {
    balance: algotradeBalance,
    pnl: algotradePnl,
    roe: algotradeRoe,
    startSessionTime,
  } = useTypedSelector((state) => {
    console.log({state})
    return state.algotrade;
  });

  return (
    <div className={clsx(styles["container"], "card", "text")}>
      {startSessionTime ? (
        <div className={styles["active-algotrade"]}>
          <div className={styles["active-algotrade__stat-item"]}>
            <span className={styles["label"]}>В работе</span>
            <span>{algotradeBalance} USDT</span>
          </div>
          <div className={styles["active-algotrade__stat-item"]}>
            <span className={styles["label"]}>Время работы</span>
            <span>{calculateElapsedTime(new Date(startSessionTime))}</span>
          </div>
          <div className={styles["active-algotrade__stat-item"]}>
            <span className={styles["label"]}>PNL</span>
            <SignedNumber value={algotradePnl} postfix={" USDT"} />
          </div>
          <div className={styles["active-algotrade__stat-item"]}>
            <span className={styles["label"]}>ROE</span>
            <SignedNumber value={algotradeRoe} postfix={" %"} />
          </div>
        </div>
      ) : (
        <div className={styles["inactive-algotrade"]}>
          <div className={styles["inactive-algotrade__image-wrapper"]}>
            <Power />
          </div>
          <p>
            Инвестиционный алгоритм отключен. Перейдите в терминал инвестора для
            начала работы.
          </p>
        </div>
      )}
      <Button
        buttonStyle="primary"
        text="Перейти в терминал"
        onClick={() => goToState(`${AppLinksEnum.TERMINAL}/investor`)}
      />
    </div>
  );
};

export default AlgotradeStats;
