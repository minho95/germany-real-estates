import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt

rooms_categories = ["1 + 1.5", "2 + 2.5", "3 + 3.5", "4 + 4.5", "5 + 5.5", "6+"]

def get_room_category(room):
    if room < 2:
        return rooms_categories[0]
    elif room < 3:
        return rooms_categories[1]
    elif room < 4:
        return rooms_categories[2]
    elif room < 5:
        return rooms_categories[3]
    elif room < 6:
        return rooms_categories[4]
    
    return rooms_categories[-1]

prices_categories = ["<0, 300K)", "<300K, 500K)", "<500K, 700K)", "<700K, 900K)", "<900K, inf)"]

def get_price_category(price):
    if price < 300000:
        return prices_categories[0]
    elif price < 500000:
        return prices_categories[1]
    elif price < 700000:
        return prices_categories[2]
    elif price < 900000:
        return prices_categories[3]
    
    return prices_categories[-1]

def show_barplot_of_prices(x="city", y="price", data=None, title="", xlabel="", ylabel="", order=None):
    fig = sns.barplot(x=x, y=y, data=data, estimator=np.median, ci=None, order=order)

    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)

    for item in fig.patches:
        if item.get_height() > 100000:
            formatted_value = f"{item.get_height() / 1000:,.0f} K €"
        else:
            formatted_value = f"{item.get_height():,.0f} K €"
        fig.annotate(formatted_value, (item.get_x() + item.get_width() / 2., item.get_height()),
                     ha='center', va='center', fontsize=11, color='black', xytext=(0, 20),
                     textcoords='offset points')

    fig.set_ylim(0, max(fig.get_yticks()) * 1.15)

    xlabels = [x.get_text().capitalize() for x in fig.get_xticklabels()]
    fig.set_xticklabels(xlabels)
    
    ylabels = [f"{x / 1000:,.0f} K €" for x in fig.get_yticks()]
    fig.set_yticklabels(ylabels)

    plt.show(fig)